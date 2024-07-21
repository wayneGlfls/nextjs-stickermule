'use client'

import React from "react";
import { RevenueChartSkeleton,LatestInvoicesSkeleton,CardsSkeleton } from '@/app/ui/skeletons';

export default function Modal({children}: { children: React.ReactNode}) {
  //const latestInvoices = await fetchLatestInvoices();
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className="">
      <button
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        type="button"
        onClick={() => setShowModal(true)}
      >
        View Invoice
      </button>
      {showModal ? (
        <>
          <div style= {{width:'100%'}} className="mt-6 h-5/6  overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-6/5 my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Invoices History
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}>
                    <span className="bg-transparent text-black  h-16 w-16 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div  className="mt-6 relative p-6 flex-auto">
                    {children}
                </div>
                {/*footer*/}
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}
