interface Props {
  fill?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ProjectsIcon(props: Props) {
  const {
    fill = "inherit",
    width = 800,
    height = 800,
    className = '',
  } = props;
  return (
    <svg
      // fill="#000000"
      // width="800px"
      // height="800px"
      className={`SvgIcon ProjectsIcon inline-block ${className}`}
      fill={fill}
      width={`${width}px`}
      height={`${height}px`}
      viewBox="0 0 32 32"
      version="1.2"
      baseProfile="tiny"
      xmlns="http://www.w3.org/2000/svg"
      overflow="inherit">
      <path d="m30 0v32h-28v-32zm-2 22h-24v8h24zm-9 3v2h-6v-2zm9-13h-24v8h24zm-9 3v2h-6v-2zm9-13h-24v8h24zm-9 3v2h-6v-2z" fillRule="nonzero" />
    </svg>
  );
}