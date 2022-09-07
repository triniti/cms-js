import React from 'react';
import { Button } from 'reactstrap';

export default function VideoAssetIcon({asset}) {
  return (
    <Button
        radius="circle"
        size="sm"
        color="hover"
        id={`button.${asset.get('_id').toString()}`}
        className={`mt-1 mb-0`}
    >
        <span className="m-0 icon-toggle icon icon-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-3-6V8a.5.5 0 0 1 .736-.44l6.67 3.942a.5.5 0 0 1 .041.857l-6.67 4.058A.5.5 0 0 1 9 16z" /></svg>
        </span>
        <span className="m-0 icon-toggle icon icon-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM7.5 7h2a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm7 0h2a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5z" /></svg>
        </span>
    </Button>
  );
}
