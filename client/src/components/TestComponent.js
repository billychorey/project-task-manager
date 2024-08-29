import React, { useRef, useEffect } from 'react';

function TestComponent() {
  const inputRef = useRef(null);

  useEffect(() => {
    console.log(inputRef.current); // Should log the input DOM element
  }, []);

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Testing useRef" />
    </div>
  );
}

export default TestComponent;
