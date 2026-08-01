import { NextResponse } from "next/server";
import { CustomerService } from "@/services/customer.service";
import { ZodError } from "zod";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || searchParams.get("q") || undefined;

    const customers = await CustomerService.getCustomers(query);
    return NextResponse.json({ success: true, count: customers.length, data: customers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = await CustomerService.createCustomer(body);

    return NextResponse.json({ success: true, message: "Customer profile upserted", data: customer }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: (error as any).issues || (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
