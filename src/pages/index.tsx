import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useState, useEffect, useRef } from "react";
import { type } from "os";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DancerAlias } from "../components/DancerAlias";
import { Dancer } from "../components/Dancer";
import { Grid } from "../components/Grid";
import { SidebarDrop } from "../components/SidebarDrop";

type dancer = {
   name: string;
   id: number;
   isOnStage: boolean;
   position: { x: number | null; y: number | null };
};

const Home: NextPage = () => {
   const [dancers, setDancers] = useState([
      { name: "Kishan Sripada", id: 222, isOnStage: true, position: { x: -1, y: 8 } },
      { name: "Mira Sripada", id: 203, isOnStage: true, position: { x: 6, y: 6 } },
      { name: "Test", id: 555, isOnStage: true, position: { x: -8, y: 8 } },
   ]);

   return (
      <>
         <DndProvider backend={HTML5Backend}>
            <div className="flex flex-row ">
               <div className="flex flex-col w-1/4">
                  {dancers.map((dancer, index) => (
                     <Dancer setDancers={setDancers} {...dancer} key={index} dancers={dancers} />
                  ))}
                  <SidebarDrop setDancers={setDancers} />
               </div>

               <Grid setDancers={setDancers} dancers={dancers}>
                  {dancers
                     .filter((dancer) => dancer.isOnStage)
                     .map((dancer, index) => (
                        <DancerAlias
                           setDancers={setDancers}
                           key={index}
                           name={dancer.name}
                           id={dancer.id}
                           {...coordsToPosition(dancer.position.x, dancer.position.y)}
                        />
                     ))}
               </Grid>
            </div>
         </DndProvider>
      </>
   );
};

const coordsToPosition = (x: number, y: number) => {
   return { left: 400 + 40 * x, top: 400 + 40 * -y };
};

export default Home;
