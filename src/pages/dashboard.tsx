import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "../components/NonAppComponents/Header";
import toast, { Toaster } from "react-hot-toast";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { MyDances } from "../components/DashboardComponents/MyDances";
import { Rosters } from "../components/DashboardComponents/Rosters";

const Dashboard = ({ dances }: {}) => {
   let session = useSession();
   const supabase = useSupabaseClient();
   const [importIsOpen, setImportIsOpen] = useState(false);
   const [danceAppLink, setDanceAppLink] = useState("");
   const router = useRouter();
   const [myDances, setMyDances] = useState(dances);
   const [menuOpen, setMenuOpen] = useState<"mydances" | "rosters" | "audio">("mydances");

   useEffect(() => {
      console.log(session);
   }, [session]);
   const deleteDance = async (id: number) => {
      const { data, error } = await supabase.from("dances").delete().eq("id", id);
      if (data) {
         toast.success("deleted dance");
      }
      if (error) {
         toast.error("there was an issue deleting your dance");
      }
   };

   async function createNewDance() {
      if (session === null) {
         router.push(`/login`);
         return;
      }

      const { data, error } = await supabase
         .from("dances")
         .insert([{ user: session.user.id, last_edited: new Date() }])
         .select("id")
         .single();

      if (!data?.id) return;
      router.push(`/${data.id}/edit`);
   }

   async function importFromDanceApp() {
      if (session === null) {
         router.push(`/login`);
         return;
      }
      const { dancers, formations } = await fetch(`/api/importFromDanceApp?url=${danceAppLink}`).then((r) => r.json());

      const { data, error } = await supabase
         .from("dances")
         .insert([{ user: session.user.id, last_edited: new Date(), dancers, formations, name: "New import from danceapp" }])
         .select("id")
         .single();

      if (!data?.id) return;
      router.push(`/${data.id}/edit`);
   }

   return (
      <>
         {importIsOpen ? (
            <div
               className="fixed top-0 left-0 z-[70] flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]"
               id="outside"
               onClick={(e) => {
                  if (e.target.id === "outside") {
                     setImportIsOpen(false);
                  }
               }}
            >
               <div className="flex  w-[700px] flex-col rounded-xl bg-white">
                  <div className="flex flex-col rounded-xl px-10 pt-10 pb-6 h-full">
                     <h1 className="text-2xl font-bold"> Import from danceapp.us</h1>

                     <input
                        value={danceAppLink}
                        onChange={(e) => {
                           setDanceAppLink(e.target.value);
                        }}
                        placeholder="danceapp.us link"
                        type="text"
                        className=" outline outline-2 rounded px-2 mt-6"
                     />
                     <div className="flex flex-row items-center justify-center">
                        <img src="https://i.imgur.com/mBCNO7A.png" className="w-48 rounded-xl mt-10" alt="" />
                        <p className="w-48 ml-10">make sure the dance is uploaded before pasting the url</p>
                     </div>
                     <button onClick={importFromDanceApp} className="ml-auto bg-blue-600 text-white px-3 mt-5 py-1 rounded-md">
                        import
                     </button>
                  </div>
               </div>
            </div>
         ) : null}
         <>
            <div className="h-screen flex flex-row font-proxima">
               <Toaster></Toaster>
               {/* <Header></Header> */}

               <div className="w-[17%] px-6 py-4 h-screen flex flex-col shadow-xl ">
                  <div className=" font-proxima">
                     <h1 className="text-5xl font-bold z-10 relative select-none">FORMI</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[100%]"></div>
                  </div>

                  <div className="flex flex-row mt-3  ">
                     <img className="rounded-md w-16 pointer-events-none select-none mr-3" src={session?.user.user_metadata.avatar_url} alt="" />
                     <div className="flex flex-col items-start justify-center">
                        <p className="font-semibold">{session?.user.user_metadata?.full_name}</p>
                        <p className="text-gray-500 text-sm">basic plan</p>
                     </div>
                  </div>

                  <button
                     className="flex flex-row justify-between items-center bg-pink-600 text-white text-sm w-full py-3 px-3 rounded-lg mt-5    font-medium"
                     onClick={createNewDance}
                  >
                     <p>new performance</p>

                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 mr-1"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                     </svg>
                  </button>

                  <button
                     className={`flex flex-row justify-between items-center ${
                        menuOpen === "mydances" ? "bg-gray-200" : ""
                     } text-black  font-medium  w-full py-3 px-3 rounded-lg mt-2`}
                     onClick={() => setMenuOpen("mydances")}
                  >
                     <p>home</p>
                  </button>
                  <button
                     className={`flex flex-row justify-between items-center ${
                        menuOpen === "rosters" ? "bg-gray-200" : ""
                     } text-black  font-medium  w-full py-3 px-3 rounded-lg mt-2`}
                     onClick={() => setMenuOpen("rosters")}
                  >
                     <p>rosters</p>
                  </button>
                  <button
                     onClick={() => setMenuOpen("audio")}
                     className={`flex flex-row justify-between items-center ${
                        menuOpen === "audio" ? "bg-gray-200" : ""
                     } text-black  font-medium  w-full py-3 px-3 rounded-lg mt-2`}
                  >
                     <p>uploaded audio</p>
                  </button>
                  <button
                     className="flex flex-row justify-between items-center mt-auto text-black  font-medium  w-full py-3 px-3 rounded-lg "
                     onClick={createNewDance}
                  >
                     <p>trash</p>
                  </button>
               </div>

               <div className="flex flex-col bg-gray-100 w-[83%] pl-10 font-proxima">
                  <div className="flex flex-row items-center justify-end p-6 text-gray-500">
                     <button>upgrade ⚡️</button>
                  </div>
                  {menuOpen === "mydances" ? <MyDances myDances={myDances}></MyDances> : menuOpen === "rosters" ? <Rosters></Rosters> : null}
               </div>
            </div>
         </>
      </>
   );
};

export default Dashboard;

export const getServerSideProps = withPageAuth({
   redirectTo: "/login",
   async getServerSideProps(ctx, supabase) {
      const {
         data: { session },
         error,
      } = await supabase.auth.getSession();
      if (error) {
         throw error;
      }
      if (!session) {
         return { props: {} };
      }
      const { user } = session;

      const { data } = await supabase.from("dances").select("*").eq("user", user.id);

      return { props: { dances: data } };
   },
});