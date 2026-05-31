import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'products.json');

// Helper to read the JSON file, seed if missing
async function readProducts() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist, seed with default data (same as products.json)
    const defaultData = [];
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
}

// Simple password for write operations – set via env var or hardcoded for demo
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const { password, product } = await request.json();
  if (password !== ADMIN_PASSWORD) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const products = await readProducts();
  const newProduct = { ...product, id: Date.now() };
  products.push(newProduct);
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), 'utf-8');
  return NextResponse.json(newProduct, { status: 201 });
}

export async function PUT(request: Request) {
  const { password, id, updates } = await request.json();
  if (password !== ADMIN_PASSWORD) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const products = await readProducts();
  const index = products.findIndex((p: any) => p.id === id);
  if (index === -1) {
    return new NextResponse('Not Found', { status: 404 });
  }
  products[index] = { ...products[index], ...updates };
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), 'utf-8');
  return NextResponse.json(products[index]);
}

export async function DELETE(request: Request) {
  const { password, id } = await request.json();
  if (password !== ADMIN_PASSWORD) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const products = await readProducts();
  const filtered = products.filter((p: any) => p.id !== id);
  await fs.writeFile(dataFilePath, JSON.stringify(filtered, null, 2), 'utf-8');
  return new NextResponse('Deleted', { status: 200 });
}
