import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        {error instanceof Error ? (
          <i>{error.message}</i>
        ) : (
          <i>Unknown error occurred</i>
        )}
      </p>
    </div>
  );
}