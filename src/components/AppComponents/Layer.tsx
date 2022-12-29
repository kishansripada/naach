import { ReactEventHandler } from "react";
import { Formation } from "./Formation";
import { useCallback, useEffect, useState } from "react";
import { dancer, dancerPosition, formation } from "../../types/types";
import { v4 as uuidv4 } from "uuid";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

export const Layer: React.FC<{
   formations: formation[];
   selectedFormation: number | null;
   setSelectedFormation: Function;
   setFormations: Function;
   songDuration: number | null;
   position: number | null;
   isPlaying: boolean;
   viewOnly: boolean;
   pixelsPerSecond: number;
   setSelectedDancers: Function;
   userPositions: any;
   onlineUsers: any;
   addToStack: Function;
   pushChange: Function;
}> = ({
   formations,
   selectedFormation,
   setSelectedFormation,
   setFormations,
   songDuration,
   position,
   isPlaying,
   viewOnly,
   pixelsPerSecond,
   setSelectedDancers,
   userPositions,
   onlineUsers,
   pushChange,
   addToStack,
}) => {
   const [activeId, setActiveId] = useState(null);

   const clickOutsideFormations = (e: any) => {
      if (e.target.id !== "outside") return;
      e.stopPropagation();
      setSelectedFormation(null);
   };

   const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
         coordinateGetter: sortableKeyboardCoordinates,
      })
   );
   function handleDragStart(event) {
      addToStack();
      setActiveId(event.active.id);
   }

   function handleDragEnd(event) {
      const { active, over } = event;

      if (active.id !== over?.id) {
         setFormations((formations: formation[]) => {
            const oldIndex = formations.findIndex((formation) => formation.id === active.id);
            const newIndex = formations.findIndex((formation) => formation.id === over.id);

            return arrayMove(formations, oldIndex, newIndex);
         });
      }
      pushChange({ isSwap: true });
      setActiveId(null);
   }

   return (
      <>
         <div className=" flex flex-row  items-center w-full bg-[#fafafa] " id="outside" onClick={clickOutsideFormations}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
               <SortableContext items={formations} strategy={horizontalListSortingStrategy}>
                  {formations.map((formation, index) => (
                     <div
                        key={formation.id}
                        id={formation.id}
                        onClick={(e: any) => {
                           if (selectedFormation === index) return;
                           setSelectedDancers([]);
                           setSelectedFormation(index);
                        }}
                     >
                        <Formation
                           userPositions={userPositions}
                           onlineUsers={onlineUsers}
                           viewOnly={viewOnly}
                           setSelectedFormation={setSelectedFormation}
                           setFormations={setFormations}
                           formation={formation}
                           index={index}
                           amSelected={index === selectedFormation}
                           pixelsPerSecond={pixelsPerSecond}
                           addToStack={addToStack}
                           activeId={activeId}
                        />
                     </div>
                  ))}
               </SortableContext>
            </DndContext>
         </div>
      </>
   );
};
