import React , { forwardRef }from 'react'

export const ComponentToPrint = forwardRef((props, ref) => {
    return (
      <div ref={ref}>
        hello
      </div>
    );
  });
