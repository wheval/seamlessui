import { Highlight } from "@/app/utilities/Highlight";
import Iframe from "@/app/utilities/Iframe";
import {
  ReactElement,
  cloneElement,
  isValidElement,
  useMemo,
  useRef,
  useState,
} from "react";
import { AssetsVariantsProps, ThemeProps, VariantsProps } from "@/types";
import Dropdown from "./Dropdown";
import { BulbIcon, CodeIcon, EyeIcon } from "@/public/icons/icons";
import { useDimension } from "@/hooks/useDimension";
import CopyButton from "../utilities/CopyButton";
import Button from "./Button";

interface ChildProps {
  layout: VariantsProps;
  theme: ThemeProps;
  showAssets: AssetsVariantsProps;
}

type Props = {
  name: string;
  description: string;
  children: ReactElement<ChildProps>;
  codeStringGenerator: ({
    full,
    theme,
    variant,
  }: {
    theme?: ThemeProps;
    variant?: VariantsProps;
    full?: boolean;
  }) => string;
  variants: VariantsProps[];
  assetsVariants?: AssetsVariantsProps;
  showAssetsVariants?: boolean;
  themeVariants?: boolean;
  layoutVariants?: boolean;
  full?: boolean;
  fullScreen?: boolean;
};

const Preview = ({
  codeStringGenerator,
  children,
  description,
  name,
  variants,
  assetsVariants,
  showAssetsVariants = false,
  themeVariants = true,
  layoutVariants = true,
  full = true,
  fullScreen = false,
}: Props) => {
  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const [theme, setTheme] = useState<ThemeProps>("light");
  const [variant, setVariant] = useState<VariantsProps>(variants[0]);
  const [showAssets, setShowAssets] = useState<AssetsVariantsProps | undefined>(
    assetsVariants
  );
  const headerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimension({ refElement: headerRef });

  const options = variants.map((opt) => ({
    optName: opt,
    optTitle: `${opt} Variant`,
    optFunc: () => setVariant(opt), // Function to set variant
  }));

  const assetOptions = ["show", "hide"].map((opt) => ({
    optName: opt,
    optTitle: `${opt} assets`,
    optFunc: () => setShowAssets(opt === "show" ? true : false), // Function to set variant
  }));

  const modifiedChildren = isValidElement(children)
    ? (() => {
        const hasLayout = "layout" in children.props;
        const hasTheme = "theme" in children.props;
        const hasShowAssets = "showAssets" in children.props;

        if (hasLayout && hasTheme) {
          return cloneElement(children, { layout: variant, theme });
        } else if (hasShowAssets && hasTheme) {
          return cloneElement(children, {
            showAssets,
            theme,
          });
        } else if (hasLayout) {
          return cloneElement(children, { layout: variant });
        } else if (hasTheme) {
          return cloneElement(children, { theme });
        } else {
          return children;
        }
      })()
    : children;

  const finalCodeString = useMemo(
    () => codeStringGenerator({ theme, variant, full }),
    [theme, variant]
  );

  return (
    <div>
      <div className="mb-20 max-w-[900px] px-2 md:px-0">
        <h2 className="mb-8 text-3xl font-bold capitalize">{name}</h2>
        <p>{description}</p>
      </div>

      <div className="flex flex-col py-4">
        <div
          ref={headerRef}
          className="mb-8 flex items-center justify-between px-2 md:px-4"
        >
          <div className="flex items-center gap-2">
            <div className="flex w-fit flex-wrap items-center gap-2">
              <p className="mr-4 text-lg font-bold capitalize">{`${name} ${layoutVariants ? `- ${variant}` : ""}`}</p>

              {layoutVariants && (
                <div className="relative z-50">
                  <Dropdown
                    name={`${variant} variant`}
                    selectedOption={variant}
                    options={options}
                  />
                </div>
              )}
              {showAssetsVariants && (
                <div className="relative z-50">
                  <Dropdown
                    name={`${showAssets ? "show" : "hide"} Assets`}
                    selectedOption={showAssets ? "show" : "hide"}
                    options={assetOptions}
                  />
                </div>
              )}
            </div>
            {themeVariants && (
              <Button
                variant="ghost"
                onClick={() => {
                  setTheme((prev) => (prev === "light" ? "dark" : "light"));
                }}
                className={`mr-2 grid h-8 min-w-8 rotate-180 place-content-center rounded-full border border-black ${theme === "light" ? "bg-black text-white" : "text-black"} text-[1.2em]`}
              >
                <BulbIcon />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative mr-4 flex gap-2 rounded-[8px] bg-[#e4e4e4] p-1">
              <Tab
                isActive={activeTab === 0}
                icon={<EyeIcon />}
                label="Preview"
                onClick={() => setActiveTab(0)}
              />
              <Tab
                isActive={activeTab === 1}
                icon={<CodeIcon />}
                label="Code"
                onClick={() => setActiveTab(1)}
              />
              <div className="absolute left-[calc(100%+1rem)] top-1/2 h-[80%] w-[1px] -translate-y-1/2 bg-black"></div>
            </div>

            <p className="hidden lg:block">React</p>
            <CopyButton
              className="text-[1.5em] text-grey-500"
              copyText={finalCodeString}
            />
          </div>
        </div>
        <div className="grid grid-cols-[1fr] grid-rows-[1fr]">
          <Highlight activeTab={activeTab} code={finalCodeString} />
          <div
            style={{
              height: `calc(100vh - ${dimensions.height}px)`,
            }}
            className={`relative col-start-1 row-start-[1] row-end-1 grid h-full max-h-[900px] rounded-[8px] bg-[#e4e4e4] ${activeTab === 0 ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <Iframe fullScreen={fullScreen}>{modifiedChildren}</Iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;

type TabProps = {
  isActive: boolean;
  icon: JSX.Element;
  label: string;
  onClick: () => void;
};

const Tab = ({ isActive, icon, label, onClick }: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex h-[38px] w-[38px] items-center justify-center gap-1 rounded-[8px] p-1 lg:min-w-[6rem] ${isActive ? "bg-black text-white" : "text-grey-500"}`}
    >
      <span className={`${isActive ? "text-white" : "text-black"}`}>
        {icon}
      </span>
      <span className="hidden lg:block">{label}</span>
    </button>
  );
};
