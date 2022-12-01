import { dancer, dancerPosition, formation } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export const Settings: React.FC<{
   stageDimensions: any;
   setStageDimensions: Function;
}> = ({ stageDimensions, setStageDimensions }) => {
   const handleMouseMove = () => {};
   return (
      <>
         <div className="w-[23%] bg-white border-r border-r-gray-300 px-6 py-6">
            <h1 className="h-12 font-medium text-xl">performance settings</h1>

            <p className="font-medium h-10">stage dimensions</p>

            <p className="text-gray-500">width</p>
            <div className="my-6 flex flex-row justify-center items-center">
               <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition duration-300"
                  onClick={() =>
                     setStageDimensions((stageDimensions) => {
                        return { ...stageDimensions, width: stageDimensions.width - 2 };
                     })
                  }
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                  </svg>
               </button>
               <div className="flex flex-col justify-center items-center">
                  <p className="mx-6 text-2xl text-gray-500">{stageDimensions.width}</p>
                  <p className="text-gray-400 text-xs">squares</p>
               </div>
               <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition duration-300"
                  onClick={() =>
                     setStageDimensions((stageDimensions) => {
                        return { ...stageDimensions, width: stageDimensions.width + 2 };
                     })
                  }
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
               </button>
            </div>

            <p className="text-gray-500">height</p>
            <div className="my-6 flex flex-row justify-center items-center">
               <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition duration-300"
                  onClick={() =>
                     setStageDimensions((stageDimensions) => {
                        return { ...stageDimensions, height: stageDimensions.height - 2 };
                     })
                  }
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                  </svg>
               </button>
               <div className="flex flex-col justify-center items-center">
                  <p className="mx-6 text-2xl text-gray-500">{stageDimensions.height}</p>
                  <p className="text-gray-400 text-xs">squares</p>
               </div>
               <button
                  className="p-2 rounded-xl hover:bg-gray-100 transition duration-300"
                  onClick={() =>
                     setStageDimensions((stageDimensions) => {
                        return { ...stageDimensions, height: stageDimensions.height + 2 };
                     })
                  }
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
               </button>
            </div>
            <p className="font-medium h-10">previous formation</p>
            <div className="border border-gray-200 rounded-xl w-full text-sm shadow-sm cursor-pointer ">
               <div className="p-4 flex flex-row items-center">
                  <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                  <p>none</p>
               </div>
               <hr />
               <div className="p-4 flex flex-row items-center">
                  <div className="rounded-full h-4 w-4 border-gray-500 border mr-3"></div>
                  <p>view ghost dancers</p>
               </div>
               <hr />
               <div className="p-4 flex flex-row items-center">
                  <div className="rounded-full h-4 w-4 border-blue-400 border mr-3 grid place-items-center">
                     <div className="rounded-full h-2 w-2 bg-blue-400"></div>
                  </div>
                  <p>view ghost dancers and paths</p>
               </div>
            </div>
         </div>
      </>
   );
};