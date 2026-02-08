import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {Log} from "@/types/log";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
