import {fetchStudentsGraphql,fetchCustomers} from "../../lib/data";

interface student {
  fullName: string;
}

export default async function Page() {

    const customers = await fetchCustomers();

    return (   
    <div> 
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
                            <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">Add friend</a>
                            <a href="#" className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 ">Message</a>
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