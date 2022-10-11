import { dancer, dancerPosition, formation, coordsToPosition } from "../../types/types";

export interface DancerAliasProps {
   dancer: dancer;
   setDancers: Function;
   selectedFormation: number | null;
   formations: formation[];
   isPlaying: boolean;
   position: number | null;
   setFormations: Function;
   // viewAllPaths: boolean;
}

export const DancerAliasShadow: React.FC<DancerAliasProps> = ({
   dancer,
   formations,
   setDancers,
   selectedFormation,
   isPlaying,
   position,
   setFormations,
}) => {
   let currentCoords = formations[selectedFormation === formations.length - 1 ? selectedFormation - 1 : selectedFormation + 1]?.positions.find(
      (dancerx: dancerPosition) => dancerx.id === dancer.id
   )?.position;

   if (selectedFormation === null || !currentCoords || isPlaying) return <></>;

   let initials = dancer.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();

   let { left, top } = coordsToPosition(currentCoords.x, currentCoords.y);

   return (
      <>
         <div
            style={{ left, top, transform: "translate(-50%, -50%)" }}
            id={dancer.id}
            className={`w-[38px] h-[38px] opacity-30 pointer-events-none  rounded-full flex flex-row justify-center items-center absolute z-[20] mr-auto ml-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 `}
         >
            {dancer.instagramUsername ? (
               <img
                  id={dancer.id}
                  draggable={false}
                  className="w-[34px] h-[34px] rounded-full select-none   "
                  src={dancer.instagramUsername}
                  alt=""
               />
            ) : (
               <div id={dancer.id} className="bg-white rounded-full  w-[34px] h-[34px] grid place-items-center select-none">
                  <p id={dancer.id} className="select-none ">
                     {initials}
                  </p>
               </div>
            )}
         </div>
      </>
   );
};
