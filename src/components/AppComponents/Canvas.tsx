import { useState, useEffect, useRef, PointerEvent, PointerEventHandler, useMemo } from "react";

import { GridLines } from "./GridLines";
import { dancer, dancerPosition, formation, dragBoxCoords, coordsToPosition, PIXELS_PER_SQUARE, GRID_HEIGHT, GRID_WIDTH } from "../../types/types";
import { CurrentFormation } from "./CurrentFormation";

export const Canvas: React.FC<{
   children: React.ReactNode;
   setDancers: Function;
   dancers: dancer[];
   setFormations: Function;
   selectedFormation: number | null;
   formations: formation[];
   selectedDancers: string[];
   setSelectedDancers: Function;
   setSelectedFormation: Function;
   setIsPlaying: Function;
   viewOnly: boolean;
}> = ({
   children,
   setDancers,
   dancers,
   setFormations,
   selectedFormation,
   formations,
   setSelectedDancers,
   selectedDancers,
   setSelectedFormation,
   setIsPlaying,
   viewOnly,
}) => {
   let [draggingDancerId, setDraggingDancerId] = useState<null | string>(null);
   const [shiftHeld, setShiftHeld] = useState(false);
   const [commandHeld, setCommandHeld] = useState(false);
   const [changingControlId, setChangingControlId] = useState<null | string>(null);
   const [addingNewDancerId, setAddingNewDancerId] = useState<null | string>(null);
   const [changingControlType, setChangingControlType] = useState<"start" | "end" | null>(null);
   const [scrollOffset, setScrollOffset] = useState({ x: -442, y: -310 });
   const [zoom, setZoom] = useState(0.7);
   const [isDragging, setIsDragging] = useState(false);
   const [copiedPositions, setCopiedPositions] = useState([]);
   const [dragBoxCoords, setDragBoxCoords] = useState<dragBoxCoords>({ start: { x: null, y: null }, end: { x: null, y: null } });
   useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      window.addEventListener("pointerdown", pointerForNewDancer);
      return () => {
         window.removeEventListener("keydown", downHandler);
         window.removeEventListener("keyup", upHandler);
         window.addEventListener("pointerdown", pointerForNewDancer);
      };
   }, [selectedFormation, commandHeld, selectedDancers, formations, copiedPositions]);

   const pointerForNewDancer = (e) => {
      if (e.target.dataset.type === "newDancer") {
         setAddingNewDancerId(true);
      }
   };

   const downHandler = (e: any) => {
      if (e?.path?.[0]?.tagName === "INPUT") return;
      // console.log(e.key);
      // if (e.key === " ") {
      //    setIsPlaying((isPlaying: boolean) => !isPlaying);
      //    e.preventDefault();
      // }
      if (e.key === "Meta") {
         setCommandHeld(true);
      }
      if (e.key === "Shift") {
         setShiftHeld(true);
      }
      if (e.key === "Escape") {
         setSelectedDancers([]);
         setDragBoxCoords({ start: { x: null, y: null }, end: { x: null, y: null } });
      }
      if (selectedFormation === null) return;

      if (e.key === "Backspace") {
         e.preventDefault();
         setFormations((formations: formation[]) => {
            return formations.map((formation, i) => {
               if (i === selectedFormation) {
                  return {
                     ...formation,
                     positions: formation.positions.filter((dancerPosition: dancerPosition) => {
                        return !selectedDancers.find((id) => dancerPosition.id === id);
                     }),
                  };
               }
               return formation;
            });
         });
         setSelectedDancers([]);
      }

      if (!commandHeld) return;

      // on paste, filter out all of the dancers that are being pasted before splicing them into the array of positions
      if (e.key === "v" && copiedPositions.length) {
         setFormations((formations: formation[]) => {
            return formations.map((formation, i) => {
               if (i === selectedFormation) {
                  return {
                     ...formation,
                     positions: [
                        ...formation.positions.filter((dancerPosition) => {
                           return !copiedPositions.map((dancerPositionCopy: dancerPosition) => dancerPositionCopy.id).includes(dancerPosition.id);
                        }),
                        ...copiedPositions,
                     ],
                  };
               }
               return formation;
            });
         });
      }
      if (e.key === "a") {
         e.preventDefault();
         setSelectedDancers([...formations[selectedFormation]?.positions.map((position) => position.id)]);
      }

      if (e.key === "c" && selectedDancers.length) {
         e.preventDefault();
         setCopiedPositions(formations[selectedFormation].positions.filter((dancerPosition) => selectedDancers.includes(dancerPosition.id)));
      }
   };

   function upHandler({ key }) {
      if (key === "Shift") {
         setShiftHeld(false);
      }
      if (key === "Meta") {
         setCommandHeld(false);
      }
   }

   const handleDragMove = (e: any) => {
      if (selectedFormation === null) return;
      if (changingControlId) {
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (index === selectedFormation - 1) {
                  return {
                     ...formation,
                     positions: formation.positions.map((dancerPosition) => {
                        if (changingControlId === dancerPosition.id && changingControlType === "start") {
                           return {
                              ...dancerPosition,
                              controlPointStart: {
                                 x: dancerPosition.controlPointStart.x + e.movementX / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.controlPointStart.y - e.movementY / PIXELS_PER_SQUARE / zoom,
                              },
                           };
                        }
                        if (changingControlId === dancerPosition.id && changingControlType === "end") {
                           return {
                              ...dancerPosition,
                              controlPointEnd: {
                                 x: dancerPosition.controlPointEnd.x + e.movementX / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.controlPointEnd.y - e.movementY / PIXELS_PER_SQUARE / zoom,
                              },
                           };
                        }
                        return dancerPosition;
                     }),
                  };
               }
               return formation;
            });
         });
      }

      if (e.target.dataset.type === "dancer" && !dragBoxCoords.start.x) {
         setIsDragging(true);
      }
      const target = e.currentTarget;

      // Get the bounding rectangle of target
      const rect = target.getBoundingClientRect();

      // Mouse position
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (dragBoxCoords.start.x && dragBoxCoords.start.y) {
         setDragBoxCoords((dragBoxCoords) => {
            return { ...dragBoxCoords, end: { x: x / zoom, y: y / zoom } };
         });
         if (
            dragBoxCoords.start.x !== null &&
            dragBoxCoords.end.y !== null &&
            dragBoxCoords.start.y !== null &&
            dragBoxCoords.end.y !== null &&
            selectedFormation !== null
         ) {
            setSelectedDancers(
               formations?.[selectedFormation]?.positions
                  .filter((dancerPosition: dancerPosition) => {
                     return (
                        coordsToPosition(dancerPosition.position.x, dancerPosition.position.y).left >
                           Math.min(dragBoxCoords.start.x, dragBoxCoords.end.x) &&
                        coordsToPosition(dancerPosition.position.x, dancerPosition.position.y).left <
                           Math.max(dragBoxCoords.start.x, dragBoxCoords.end.x) &&
                        coordsToPosition(dancerPosition.position.x, dancerPosition.position.y).top >
                           Math.min(dragBoxCoords.start.y, dragBoxCoords.end.y) &&
                        coordsToPosition(dancerPosition.position.x, dancerPosition.position.y).top <
                           Math.max(dragBoxCoords.start.y, dragBoxCoords.end.y)
                     );
                  })
                  .map((dancerPosition: dancerPosition) => dancerPosition.id)
            );
         }
      }
      if (draggingDancerId) {
         setFormations((formations: formation[]) => {
            return formations.map((formation, index: number) => {
               if (index === selectedFormation) {
                  return {
                     ...formation,
                     positions: formation.positions.map((dancerPosition) => {
                        if (selectedDancers.includes(dancerPosition.id)) {
                           return {
                              ...dancerPosition,
                              position: {
                                 x: dancerPosition.position.x + e.movementX / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.position.y - e.movementY / PIXELS_PER_SQUARE / zoom,
                              },
                           };
                        }
                        return dancerPosition;
                     }),
                  };
               }
               if (index === selectedFormation - 1) {
                  return {
                     ...formation,
                     positions: formation.positions.map((dancerPosition) => {
                        if (selectedDancers.includes(dancerPosition.id) && dancerPosition.transitionType === "cubic") {
                           return {
                              ...dancerPosition,
                              controlPointEnd: {
                                 x: dancerPosition.controlPointEnd.x + e.movementX / PIXELS_PER_SQUARE / zoom,
                                 y: dancerPosition.controlPointEnd.y - e.movementY / PIXELS_PER_SQUARE / zoom,
                              },
                           };
                        }
                        return dancerPosition;
                     }),
                  };
               }
               return formation;
            });
         });
      }
   };

   const pointerDown = (e: any) => {
      // console.log(e.target.dataset.type);

      if (e.target.dataset.type === "controlPointStart") {
         setChangingControlId(e.target.id);
         setChangingControlType("start");
      }
      if (e.target.dataset.type === "controlPointEnd") {
         setChangingControlId(e.target.id);
         setChangingControlType("end");
      }
      if (!e.target.id) {
         setSelectedDancers([]);
         // Get the target
         const target = e.currentTarget;
         // console.log(target);
         // Get the bounding rectangle of target
         const rect = target.getBoundingClientRect();

         // Mouse position
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;

         setDragBoxCoords((dragBoxCoords) => {
            return { ...dragBoxCoords, start: { x: x / zoom, y: y / zoom } };
         });
      }
      if (e.target.dataset.type === "dancer") {
         setDraggingDancerId(e.target.id);
         if (!shiftHeld && !selectedDancers.includes(e.target.id)) {
            setSelectedDancers([e.target.id]);
         }

         if (shiftHeld) {
            if (!selectedDancers.includes(e.target.id)) {
               setSelectedDancers((selectedDancers: string[]) => [...selectedDancers, e.target.id]);
            } else {
               setSelectedDancers((selectedDancers: string[]) => selectedDancers.filter((id) => id !== e.target.id));
            }
         }
      }
   };

   const pointerUp = (e: any) => {
      setChangingControlId(null);
      setChangingControlType(null);
      setDragBoxCoords({ start: { x: null, y: null }, end: { x: null, y: null } });
      if (e.target.dataset.type === "dancer" && !shiftHeld && !isDragging) {
         setSelectedDancers([e.target.id]);
      }
      // if a dancer was dragged (moved), then update round the formations to the nearest whole (persists to database)
      if (isDragging) {
         setFormations((formations: formation[]) => {
            return formations.map((formation) => {
               return {
                  ...formation,
                  positions: formation.positions.map((position) => {
                     return { ...position, position: { x: Math.round(position.position.x), y: Math.round(position.position.y) } };
                  }),
               };
            });
         });
      }
      setDraggingDancerId(null);
      setIsDragging(false);
   };

   useEffect(() => {
      window.addEventListener("wheel", handleScroll, { passive: false });

      return () => {
         window.removeEventListener("wheel", handleScroll);
      };
   }, []);

   const handleScroll = (e) => {
      if (
         e
            .composedPath()
            .map((elem) => elem.id)
            .includes("stage") &&
         e.ctrlKey === false
      ) {
         e.preventDefault();
         setScrollOffset((scrollOffset) => {
            return { y: scrollOffset.y - e.deltaY, x: scrollOffset.x - e.deltaX };
         });
      }
      if (
         e
            .composedPath()
            .map((elem) => elem.id)
            .includes("stage") &&
         e.ctrlKey === true
      ) {
         e.preventDefault();
         setZoom((zoom) => (zoom - e.deltaY / 200 > 0.2 && zoom - e.deltaY / 200 < 1.2 ? zoom - e.deltaY / 200 : zoom));
      }
   };
   return (
      <div
         className="flex flex-row  h-full cursor-default w-full overflow-hidden mx-4 px-3 rounded-xl overscroll-contain "
         id="stage"
         onPointerUp={!viewOnly ? pointerUp : null}
      >
         <div
            className="relative bg-white "
            onPointerDown={!viewOnly ? pointerDown : null}
            onPointerMove={handleDragMove}
            style={{
               top: scrollOffset.y,
               left: scrollOffset.x,
               // transformOrigin: `${scrollOffset.x}px ${scrollOffset.y}px`,
               transform: `scale(${zoom}) `,
               // translate(${scrollOffset.x}px, ${scrollOffset.y}px)
               height: GRID_HEIGHT * PIXELS_PER_SQUARE,
               width: GRID_WIDTH * PIXELS_PER_SQUARE,
            }}
         >
            {children}

            {dragBoxCoords.start.x && dragBoxCoords.end.x && dragBoxCoords.start.y && dragBoxCoords.end.y ? (
               <div
                  className="absolute bg-blue-200/50 z-10 cursor-default "
                  style={{
                     width: Math.abs(dragBoxCoords.end.x - dragBoxCoords.start.x),
                     height: Math.abs(dragBoxCoords.end.y - dragBoxCoords.start.y),
                     left: dragBoxCoords.end.x - dragBoxCoords.start.x < 0 ? dragBoxCoords.end.x : dragBoxCoords.start.x,
                     top: dragBoxCoords.end.y - dragBoxCoords.start.y < 0 ? dragBoxCoords.end.y : dragBoxCoords.start.y,
                  }}
               ></div>
            ) : (
               <></>
            )}

            <GridLines />
         </div>
      </div>
   );
};
