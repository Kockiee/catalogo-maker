'use client'
import { Toast } from "flowbite-react";
import { useState } from "react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

export default function Notification({type, message, setPattern}) {
    return (
        <div className="fixed bottom-4 left-0 w-full flex justify-center z-20">
            {type === 'success' ? (
                <Toast>
                  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                    <HiCheck className="h-5 w-5" />
                  </div>
                  <div className="ml-3 text-sm font-normal">{message}</div>
                  <Toast.Toggle onDismiss={() => setPattern(<></>)}/>
                </Toast>
            ) : type === 'warning' ? (
                <Toast>
                  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                    <HiExclamation className="h-5 w-5" />
                  </div>
                  <div className="ml-3 text-sm font-normal">{message}</div>
                  <Toast.Toggle onDismiss={() => setPattern(<></>)}/>
                </Toast>
            ) : (
                <Toast>
                  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                    <HiX className="h-5 w-5" />
                  </div>
                  <div className="ml-3 text-sm font-normal">{message}</div>
                  <Toast.Toggle onDismiss={() => setPattern(<></>)}/>
                </Toast>
            )}
        </div>
    )
}