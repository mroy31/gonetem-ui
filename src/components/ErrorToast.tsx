
import * as React from 'react';

export default function ErrorToast({
    error,
    clearError,
}: {
    error: string,
    clearError: () => void
}): JSX.Element {
    return (
        <div className="toast toast-center">
          <div className="alert alert-error flex gap-2 w-5/6 overflow-x-scroll">
            <span>{error}</span>
            <button
                className='btn btn-outline btn-neutral'
                onClick={clearError}
            >
                X
            </button>
          </div>
        </div>
    );
}