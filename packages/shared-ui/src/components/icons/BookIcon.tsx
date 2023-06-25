interface Props {
  fill?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function BookIcon(props: Props) {
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
      className={`SvgIcon BookIcon inline-block ${className}`}
      fill={fill}
      width={`${width}px`}
      height={`${height}px`}
      viewBox="0 0 50 50"
      version="1.2"
      baseProfile="tiny"
      xmlns="http://www.w3.org/2000/svg"
      overflow="inherit">
      <path d="M41 40v-34c0-2.2-1.8-4-4-4h-24c-2.2 0-4 1.8-4 4v38c0 2.2 1.8 4 4 4h24c1.858 0 4 0 4-2v-1h-27c-1.1 0-2-.9-2-2v-3h29zm-27-30c0-.55.45-1 1-1h20c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1h-20c-.55 0-1-.45-1-1v-2zm0 8c0-.55.45-1 1-1h20c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1h-20c-.55 0-1-.45-1-1v-2z" />
    </svg>
  );
}