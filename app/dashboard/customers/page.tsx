import {fetchStudentsGraphql,fetchCustomers} from "../../lib/data";
import { lusitana } from '@/app/ui/fonts';
import PopUpParent from "@/app/ui/customers/popUpParent";

interface student {
  fullName: string;
}

export default async function Page() {
    const customers = await fetchCustomers();

    return (   
    <div> 
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      </div>
      <div className="bg-white">
        <div className="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="mt-0 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {customers.map((customer) => (
                <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow ">
                    <div className="flex justify-end px-4 pt-4">
                    </div>
                    <div className="flex flex-col items-center pb-10">
                        <img className="w-18 h-18 mt-6 rounded-full shadow-lg" src={customer.image_url} alt="Bonnie image"/>
                        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{customer.name}</h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</span>
                        <div className="flex mt-4 md:mt-6">
                            {<PopUpParent customerId={customer.id}/>}                            
                        </div>
                    </div>
                </div>

            ))}
          </div>
        </div>
      </div>
    </div>
    
  );
}