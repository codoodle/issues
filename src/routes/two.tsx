import { createFileRoute, useBlocker, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/two")({
  component: Two,
});

function Two() {
  useBlocker({
    shouldBlockFn: () => {
      return !confirm("Are you sure you want to leave?");
    },
  });

  const router = useRouter();

  const handleBack = () => {
    router.history.back({
      ignoreBlocker: true,
    });
  };

  const handleGo = () => {
    router.history.go(-1, {
      ignoreBlocker: true,
    });
  };

  return (
    <div>
      <h1>Hello "/two"!</h1>
      <button onClick={handleBack}>Back</button>
      <button onClick={handleGo}>Go(-1)</button>
    </div>
  );
}
