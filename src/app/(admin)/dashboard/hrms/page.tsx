"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users, UserCheck, UserX, Calendar, Clock, Plus, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { useRealtime } from "@/hooks/useRealtime";

export default function HrmsDashboardPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>({ totalEmployees: 0, presentToday: 0, absentToday: 0, pendingLeaves: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Reception",
    designation: "Front Desk Executive",
    shift: "Morning",
    salary: "25000",
  });

  const fetchHrmsData = useCallback(async () => {
    try {
      const [empRes, attRes] = await Promise.all([
        fetch("/api/hrms/employees"),
        fetch("/api/hrms/attendance"),
      ]);
      const empJson = await empRes.json();
      const attJson = await attRes.json();

      if (empJson.success) setEmployees(empJson.data);
      if (attJson.success && attJson.kpis) setKpis(attJson.kpis);
    } catch (err) {
      console.error("Failed to fetch HRMS data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useRealtime(["HRMS_UPDATED", "DASHBOARD_REFRESH"], () => {
    fetchHrmsData();
  });

  useEffect(() => {
    fetchHrmsData();
  }, [fetchHrmsData]);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/hrms/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, salary: Number(formData.salary) }),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        setFormData({ name: "", email: "", phone: "", department: "Reception", designation: "Front Desk Executive", shift: "Morning", salary: "25000" });
        fetchHrmsData();
      }
    } catch (err) {
      console.error("Failed to create employee:", err);
    }
  };

  const handleMarkAttendance = async (employeeId: string, status: string) => {
    try {
      await fetch("/api/hrms/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, status }),
      });
      fetchHrmsData();
    } catch (err) {
      console.error("Failed to mark attendance:", err);
    }
  };

  const filteredEmployees = employees.filter((e) => {
    if (selectedDept === "ALL") return true;
    return e.department === selectedDept;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-white">HRMS Staff & Attendance Suite</h2>
          <p className="text-xs text-neutral-400 font-light">
            Employee profiles, department rosters, daily attendance, biometric sync, and payroll processing.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#C5A880] hover:bg-[#A37C40] text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-lg self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Employee Profile</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-950 border border-white/10 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Staff</span>
            <Users className="h-4 w-4 text-[#C5A880]" />
          </div>
          <span className="font-serif text-2xl font-bold text-white block">{kpis.totalEmployees}</span>
        </div>

        <div className="bg-neutral-950 border border-white/10 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Present Today</span>
            <UserCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="font-serif text-2xl font-bold text-emerald-400 block">{kpis.presentToday}</span>
        </div>

        <div className="bg-neutral-950 border border-white/10 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Absent / Off</span>
            <UserX className="h-4 w-4 text-red-400" />
          </div>
          <span className="font-serif text-2xl font-bold text-red-400 block">{kpis.absentToday}</span>
        </div>

        <div className="bg-neutral-950 border border-white/10 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Pending Leaves</span>
            <Calendar className="h-4 w-4 text-amber-400" />
          </div>
          <span className="font-serif text-2xl font-bold text-amber-400 block">{kpis.pendingLeaves}</span>
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold uppercase tracking-wider">
        {["ALL", "Reception", "Restaurant", "Kitchen", "Housekeeping", "Maintenance", "Accounts", "Management"].map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
              selectedDept === dept
                ? "bg-[#C5A880] text-black border-[#C5A880] font-bold"
                : "bg-neutral-900/60 text-neutral-400 border-white/10 hover:text-white hover:bg-neutral-800"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Roster Table */}
      <div className="border border-white/10 bg-neutral-950 rounded-xl overflow-hidden shadow-lux">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900/80 text-neutral-400 border-b border-white/10 text-[10px] uppercase tracking-widest font-bold">
                <th className="p-4">Staff Code & Name</th>
                <th className="p-4">Department & Designation</th>
                <th className="p-4">Shift & Biometric ID</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Monthly Salary</th>
                <th className="p-4 text-right">Attendance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 font-light">
                    {loading ? "Loading staff roster..." : "No employee profiles found in this department."}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((e) => (
                  <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 space-y-0.5">
                      <span className="font-medium text-white block">{e.name}</span>
                      <span className="text-[10px] text-[#C5A880] font-mono font-bold">{e.employeeCode}</span>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <span className="font-medium text-white block">{e.department}</span>
                      <span className="text-[10px] text-neutral-400">{e.designation}</span>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-white/10 text-[9px] uppercase font-bold text-neutral-300">
                        {e.shift} Shift
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono block">{e.biometricId || "BIO-N/A"}</span>
                    </td>
                    <td className="p-4 font-mono text-[11px]">{e.phone}</td>
                    <td className="p-4 font-mono font-bold text-white">₹{e.salary.toLocaleString()}</td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleMarkAttendance(e.id, "PRESENT")}
                        className="px-2 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 font-bold text-[9px] uppercase rounded cursor-pointer transition-colors"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(e.id, "ABSENT")}
                        className="px-2 py-1 bg-red-950/80 hover:bg-red-900 border border-red-500/30 text-red-300 font-bold text-[9px] uppercase rounded cursor-pointer transition-colors"
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-neutral-950 border border-white/10 rounded-xl p-6 space-y-4 shadow-lux">
            <h3 className="font-serif text-lg font-bold text-white">Create Employee Profile</h3>
            <form onSubmit={handleCreateEmployee} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  >
                    {["Reception", "Restaurant", "Kitchen", "Housekeeping", "Maintenance", "Accounts", "Management"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#C5A880] text-black font-bold rounded"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
