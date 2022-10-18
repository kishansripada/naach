import Script from "next/script";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { PIXELS_PER_SECOND, formation } from "../../types/types";
import { v4 as uuidv4 } from "uuid";

export const SoundCloudComponent: React.FC<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;
   songDuration: number | null;
   soundCloudTrackId: string | null;
   setSoundCloudTrackId: Function;
   setSelectedFormation: Function;
   setFormations: Function;
}> = memo(
   ({ setPosition, setIsPlaying, setSongDuration, songDuration, soundCloudTrackId, setSoundCloudTrackId, setFormations, setSelectedFormation }) => {
      const [newUrl, setNewUrl] = useState("");
      const [player, setPlayer] = useState(null);

      console.log("SoundCloudComponent rerendered");

      function handleLoad() {
         console.log("handling load");

         let SC = (window as any).SC;
         var widgetIframe = document.getElementById("iframe");
         setPlayer(SC.Widget(widgetIframe));
         let player = SC.Widget(widgetIframe);

         player.bind(SC.Widget.Events.READY, (e: any) => {
            // console.log("ready");
            player.getDuration((e: any) => {
               // console.log("getting duration");
               setSongDuration(e);
            });
            // console.log("new position bound");
            player.bind(SC.Widget.Events.PLAY_PROGRESS, (e: any) => {
               setPosition(Math.ceil(e.currentPosition / 1000 / 0.033) * 0.033);
            });

            player.bind(SC.Widget.Events.PLAY, () => {
               console.log("play fired");
               setIsPlaying(true);
            });
            player.bind(SC.Widget.Events.PAUSE, () => {
               setIsPlaying(false);
            });
            player.bind(SC.Widget.Events.FINISH, () => {
               setIsPlaying(false);
            });
         });
      }

      return (
         <>
            <div
               className="fixed flex flex-row justify-start "
               style={{
                  left: "50%",
                  transform: "translateX(-50%)",
               }}
            >
               <button
                  onClick={() => (player ? (player as any).toggle() : null)}
                  className=" rounded-b-md bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 mx-1 "
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z"
                     />
                  </svg>
               </button>
               <button
                  onClick={() => {
                     setFormations((formations: formation[]) => {
                        if (!formations.length) {
                           setSelectedFormation(formations.length);
                           return [
                              ...formations,
                              {
                                 id: uuidv4(),
                                 durationSeconds: 10,
                                 positions: [],
                                 transition: {
                                    durationSeconds: 5,
                                 },
                                 name: `Untitled ${formations.length + 1}`,
                              },
                           ];
                        } else {
                           setSelectedFormation(formations.length);
                           return [
                              ...formations,
                              {
                                 ...formations[formations.length - 1],
                                 name: `Untitled ${formations.length + 1}`,
                                 transition: {
                                    durationSeconds: 5,
                                 },
                                 durationSeconds: 10,
                              },
                           ];
                        }
                     });
                  }}
                  className=" rounded-b-md bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 mx-1 cursor-pointer"
               >
                  + new formation
               </button>
            </div>
            <Script onReady={handleLoad} strategy="lazyOnload" src="https://w.soundcloud.com/player/api.js" />

            <div className="">
               <iframe
                  scrolling="no"
                  frameBorder="no"
                  id="iframe"
                  width={songDuration ? (songDuration / 1000) * PIXELS_PER_SECOND + 130 : "100%"}
                  height="95"
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${soundCloudTrackId}&color=%23b42ae7&auto_play=false`}
               ></iframe>
            </div>
         </>
      );
   }
);
