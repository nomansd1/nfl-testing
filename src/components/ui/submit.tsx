import { ReactElement } from "react";
import { useFormStatus } from "react-dom";

export default function Submit({ defaultLabel, processingLabel }: { defaultLabel: string, processingLabel: any }) {
    const { pending } = useFormStatus();
    return (
        <button type='submit'
            className="bg-primary hover:bg-primary-hover text-white w-full mt-5 py-2 px-3 rounded-md font-medium focus:outline-none text-center">
            {pending ? processingLabel : defaultLabel}
        </button>
    )
}