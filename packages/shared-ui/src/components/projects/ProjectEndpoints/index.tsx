import { BackendEndpoint, PlatformClient, useComponentDidMount } from "@lili-project/lili-store";
import { useState } from "react";

interface Props {
  project_dir: string;
}

export function ProjectEndpoints(props: Props) {
  const [endpoints, setEndpoints] = useState<BackendEndpoint[]>([]);
  const [currentEndpoint, setCurrentEndpoint] = useState<BackendEndpoint | null>(null);

  useComponentDidMount(async () => {
    await PlatformClient.client().getEndpoints(props.project_dir).then((data) => {
      console.log(`[ProjectEndpoints] Endpoints: ${JSON.stringify(data)}`);
      setEndpoints(data);
    }).catch(e => {
      console.log(`[ProjectEndpoints] Error: ${e}`);
    });
  });

  if (!endpoints.length) {
    return null;
  }

  return (
    <div className="py-2">
      <h3 className="px-3 text-xs text-gray-500 mb-2">Endpoints</h3>
      <div className="flex flex-row gap-2">
        <div className="w-1/2 flex flex-col">
          <div className="max-h-80 overflow-y-auto">
            {endpoints.map((endpoint) => (
              <EndpointItem
                key={endpoint.path}
                endpoint={endpoint}
                onClick={() => setCurrentEndpoint(endpoint)}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 pr-3">
          <CurrentEndpointDetails endpoint={currentEndpoint} />
        </div>
      </div>
    </div>
  );
}

interface ItemProps {
  endpoint: BackendEndpoint;
  onClick: () => void;
}

function EndpointItem(props: ItemProps) {
  return (
    <div className="px-3 mb-1 text-xs text-slate-400 leading-5 cursor-pointer">
      <div
        className="group p-2 flex flex-col items-start bg-gradient-to-b from-slate-800 to-slate-900 hover:from-sky-800 hover:to-sky-900 rounded-md"
        onClick={props.onClick}
      >
        <div className="flex-1 group-hover:text-white">{props.endpoint.method} {props.endpoint.path}</div>
        <div className="flex-1 text-slate-500 group-hover:text-sky-400">{props.endpoint.function_name}</div>
      </div>
    </div>
  );
}

interface DetailsProps {
  endpoint: BackendEndpoint | null;
}

function CurrentEndpointDetails(props: DetailsProps) {
  if (!props.endpoint) {
    return null;
  }

  const headerContent = (
    <div className="px-3 pb-2 text-xs text-slate-500 leading-5">
      {props.endpoint.function_name} - {props.endpoint.method} {props.endpoint.path}
    </div>
  );

  if (!props.endpoint.request_body) {
    return (
      <>
        {headerContent}
        <div className="py-10 text-center text-xs">
          No request body
        </div>
      </>
    );
  }

  return (
    <>
      {headerContent}
      <pre
        className="py-2 px-3 text-xs text-slate-400 leading-5 bg-slate-800"
      >{props.endpoint.request_body.content}</pre>
    </>
  );
}
