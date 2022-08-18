import React, { useState } from "react";

type dancer = {
   name: string;
   id: number;
   isOnStage: boolean;
   position: { x: number | null; y: number | null };
};

export const NewDancer = ({ setDancers }: { setDancers: Function }) => {
   const [newName, setNewName] = useState("");

   const createNewDancer = () => {
      setDancers((dancers: dancer[]) => {
         return [...dancers, { name: newName, id: Math.round(Math.random() * 1000), isOnStage: false, position: { x: null, y: null } }];
      });
      setNewName("");
   };
   return (
      <>
         <div
            className="flex flex-row items-center bg-slate-300 border-black border-2"
            style={{
               opacity: 0.7,
            }}
         >
            new
            <div className="w-12 h-12 bg-red-500 rounded-full flex flex-row justify-center items-center">
               <p className="pointer-events-none select-none">New</p>
            </div>
            <input
               onKeyDown={(event) => (event.key === "Enter" && newName != "" ? createNewDancer() : null)}
               placeholder="New dancer"
               value={newName}
               onChange={(e) => setNewName(e.target.value)}
               onBlur={createNewDancer}
            />
         </div>
      </>
   );
};
