import { SignUp } from "@clerk/nextjs";
import { BookOpen, Brush, FolderOpen } from "lucide-react";

export default function Page() {
    return (


        <section className="bg-white m-auto min-h-full mt-20 max-w-3xl">

            <div className="flex max-w-full">
                <div>
                    <SignUp path="/sign-up" />

                </div>

                <div
                    className="rounded-lg min-h-full text-white  text-xl flex flex-col  justify-between p-10 bg-blue-400">
                    <div className="flex flex-col gap-1">
                        <BookOpen size={40} />
                        <h1> <strong>Browse unique form </strong> generated just for you.No templates here.</h1>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2>    <Brush size={40} /></h2>
                        <p> <strong> Customize your form </strong>with 100s of theme, layout, color options.</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2>  <FolderOpen size={40} /></h2>
                        <p> <strong> Share form</strong> with anyone and anywhere.</p>
                    </div>

                </div>

            </div>
        </section>

    )
}