'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { User } from './definitions';

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }
    
    const { customerId, amount, status } = validatedFields.data; 
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
  
  try{
      await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  }catch(error){
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

}

export async function createChatMessage(ChatMessage:any){
  //console.log(JSON.stringify(ChatMessage));
  //console.log('username is '+ChatMessage.user.name);
  const name = ChatMessage.user.id;
  //console.log('user id is '+ChatMessage.user.id);
  const data = ChatMessage.data;
  const date = new Date().toISOString().split('T')[0];
  const chatroom_id = '1ca73037-6587-4066-bf2f-8dda600f3d39';
  try{
    const saveresult = await sql`
    INSERT INTO chatmessages(customer_id,data,date,chatroom_id)
    VALUES (${name},${data},${date},${chatroom_id})
  `;
    //console.log(`saveresult is ${saveresult}`);
  }catch(error){
    return {
      message: 'Database Error: Failed to save chat messages.',
    };
  }

};

export async function getUser(name:string){
  try {
    const user = await sql<User>`SELECT * FROM users WHERE name=${name}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true }); 
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  
  try{
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
}
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
