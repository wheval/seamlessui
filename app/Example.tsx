"use client";

import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Loading } from "@/app/utilities/Loading";

export default function Connect() {
  const connectPopover = useRef<HTMLDialogElement>(null);
  const { connect, connectors, status: connectStatus } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  useEffect(() => {
    if (connectStatus === "error" || connectStatus === "success") {
      connectPopover.current?.close();
    }
  }, [connectStatus]);

  // Helper function to shorten the address
  const shortenAddress = (address: string) => {
    return address
      ? `${address.slice(0, 6)}...${address.slice(address.length - 3)}`
      : "";
  };

  return (
    <>
      <div className="grid h-full w-full place-content-center">
        <button
          onClick={() => {
            if (address) {
              disconnect();
            } else {
              connectPopover.current?.showModal();
            }
          }}
          aria-haspopup="menu"
          className="min-w-[8rem] rounded-[8px] bg-blue-700 px-4 py-2 text-white"
        >
          {address ? shortenAddress(address) : "connect"}
        </button>
      </div>

      <dialog
        id="connect-modal"
        ref={connectPopover}
        className="mx-auto my-auto bg-transparent"
      >
        <div className="relative max-h-[390px] w-[90vw] max-w-[25rem] rounded-[24px] bg-base-dark bg-dark-linear-gradient p-8 text-base text-grey-50 lg:max-h-[480px]">
          {connectStatus === "pending" && <Loading />}

          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold lg:text-2xl">Connect</h3>

            <button
              onClick={() => {
                connectPopover.current?.close();
              }}
              className="w-fit rounded-full bg-grey-800 p-1"
            >
              <X />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <div>
            <h4 className="mb-8 font-bold">Popular</h4>
            <div className="grid w-full grid-cols-3 gap-2 lg:grid-cols-2">
              {connectors.map((connector) => {
                const { name, icon } = connector;
                return (
                  <ConnectButton
                    key={name}
                    name={name}
                    func={() => connect({ connector })}
                    src={icon}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

function ConnectButton({
  name,
  func,

  src,
}: {
  name: string;
  func: () => void;
  src: string | { dark: string; light: string };
}) {
  const [base64DataUrl, setBase64DataUrl] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const svgToBase64 = (
      svgString: string | { dark: string; light: string }
    ) => {
      if (typeof svgString === "string") {
        return svgString.startsWith("<svg")
          ? `data:image/svg+xml;base64,${btoa(svgString)}`
          : svgString;
      }
      return svgString.light.startsWith("<svg")
        ? `data:image/svg+xml;base64,${btoa(svgString.light)}`
        : svgString.light;
    };

    setBase64DataUrl(svgToBase64(src));
  }, [src]);

  return (
    <button
      onClick={func}
      className="mx-auto flex h-[104px] w-full flex-col items-center justify-center gap-4 rounded-[12px] border-[1px] border-solid border-transparent bg-grey-900 p-1 text-sm hover:border-grey-700 hover:bg-grey-800 focus:border-grey-700 focus:bg-grey-800 focus:outline-none lg:h-[124px]"
    >
      <img
        className="h-[24px] w-[24px]"
        src={base64DataUrl || "https://placehold.co/24x24"}
        alt={`${name} icon`}
      />
      <span className="text-xs capitalize lg:text-sm">{name}</span>
    </button>
  );
}
