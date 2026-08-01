import prisma from "@/lib/prisma";
import { AuditLogService } from "@/services/audit.service";
import { NotificationService } from "@/services/notification.service";
import { realtimeBus } from "@/lib/events";

export interface CreateEmployeeInput {
  name: string;
  email?: string;
  phone: string;
  department: string;
  designation: string;
  shift?: string;
  salary: number;
  emergencyContact?: string;
  biometricId?: string;
}

export class HrmsService {
  /**
   * Get all Employees with optional Department filter
   */
  public static async getEmployees(department?: string) {
    const where = department ? { department } : {};
    return await prisma.employee.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        attendances: { take: 5, orderBy: { date: "desc" } },
        leaveRequests: { take: 5, orderBy: { createdAt: "desc" } },
      },
    });
  }

  /**
   * Create Employee Profile
   */
  public static async createEmployee(data: CreateEmployeeInput) {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const employeeCode = `EMP-${randomSeq}`;

    const employee = await prisma.employee.create({
      data: {
        employeeCode,
        name: data.name,
        email: data.email || null,
        phone: data.phone,
        department: data.department,
        designation: data.designation,
        shift: data.shift || "Morning",
        salary: data.salary,
        emergencyContact: data.emergencyContact || null,
        biometricId: data.biometricId || `BIO-${randomSeq}`,
      },
    });

    await AuditLogService.log({
      action: "EMPLOYEE_CREATED",
      details: `Created staff profile for ${employee.name} (${employee.department} - ${employee.designation})`,
    });

    realtimeBus.broadcast("HRMS_UPDATED", "EMPLOYEE_CREATED", employee);
    realtimeBus.broadcast("DASHBOARD_REFRESH", "EMPLOYEE_ADDED");

    return employee;
  }

  /**
   * Record Attendance / Biometric Clock In/Out
   */
  public static async recordAttendance(employeeId: string, status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY" | "LEAVE", overtimeHours = 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.create({
      data: {
        employeeId,
        date: today,
        clockIn: new Date(),
        status,
        overtimeHours,
      },
    });

    await AuditLogService.log({
      action: "ATTENDANCE_RECORDED",
      details: `Recorded attendance status '${status}' for employee ID ${employeeId}`,
    });

    realtimeBus.broadcast("DASHBOARD_REFRESH", "ATTENDANCE_RECORDED");

    return attendance;
  }

  /**
   * Create Leave Request
   */
  public static async createLeaveRequest(data: {
    employeeId: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) {
    const leave = await prisma.leaveRequest.create({
      data: {
        employeeId: data.employeeId,
        leaveType: data.leaveType,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        reason: data.reason,
        status: "PENDING",
      },
    });

    await NotificationService.createNotification({
      title: "New Leave Application",
      message: `Staff ID ${data.employeeId} applied for ${data.leaveType} leave.`,
      type: "INFO",
      link: "/dashboard/hrms",
    });

    realtimeBus.broadcast("DASHBOARD_REFRESH", "LEAVE_APPLIED");

    return leave;
  }

  /**
   * Update Leave Request Status (APPROVED / REJECTED)
   */
  public static async updateLeaveStatus(id: string, status: "APPROVED" | "REJECTED") {
    const leave = await prisma.leaveRequest.update({
      where: { id },
      data: { status },
    });

    if (status === "APPROVED") {
      await prisma.employee.update({
        where: { id: leave.employeeId },
        data: { status: "ON_LEAVE" },
      });
    }

    await AuditLogService.log({
      action: "LEAVE_STATUS_UPDATED",
      details: `Updated leave request ${id} status to '${status}'`,
    });

    realtimeBus.broadcast("DASHBOARD_REFRESH", "LEAVE_UPDATED");

    return leave;
  }

  /**
   * Generate Monthly Payroll
   */
  public static async generateMonthlyPayroll(month: number, year: number) {
    const employees = await prisma.employee.findMany({ where: { status: "ACTIVE" } });

    const payrolls = [];
    for (const emp of employees) {
      const basicSalary = emp.salary;
      const allowances = 2000;
      const deductions = 500;
      const netSalary = basicSalary + allowances - deductions;

      const payroll = await prisma.payroll.create({
        data: {
          employeeId: emp.id,
          month,
          year,
          basicSalary,
          allowances,
          deductions,
          netSalary,
          paymentStatus: "PAID",
        },
      });
      payrolls.push(payroll);
    }

    await AuditLogService.log({
      action: "PAYROLL_GENERATED",
      details: `Generated monthly payroll for ${payrolls.length} active employees (${month}/${year})`,
    });

    return payrolls;
  }

  /**
   * HR Dashboard KPIs Summary
   */
  public static async getHrDashboardKpis() {
    const totalEmployees = await prisma.employee.count();
    const activeEmployees = await prisma.employee.count({ where: { status: "ACTIVE" } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const presentToday = await prisma.attendance.count({
      where: { date: { gte: today }, status: "PRESENT" },
    });

    const pendingLeaves = await prisma.leaveRequest.count({
      where: { status: "PENDING" },
    });

    return {
      totalEmployees,
      activeEmployees,
      presentToday,
      absentToday: Math.max(0, activeEmployees - presentToday),
      pendingLeaves,
    };
  }
}
