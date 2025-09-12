import test from 'tape';
import parseIframeSrc from './parseIframeSrc.js';

// Mock DOMParser for Node.js environment
global.DOMParser = class DOMParser {
  parseFromString(html) {
    const iframeMatch = html.match(/<iframe[^>]*src=["']?([^"'\s>]+)["']?[^>]*>/i);
    if (!iframeMatch) return { querySelector: () => null };
    
    const srcValue = iframeMatch[1];
    return {
      querySelector: (selector) => selector === 'iframe' ? {
        getAttribute: (attr) => attr === 'src' ? srcValue : null,
        src: srcValue
      } : null
    };
  }
};

// Helper function to test parseIframeSrc
const testParseIframeSrc = (input, expected, description) => {
  const result = parseIframeSrc(input);
  return { actual: result, expected, description };
};

test('parseIframeSrc handles various inputs', (t) => {
  const testCases = [
    ['https://example.com', null, 'Simple URL (not iframe)'],
    ['<iframe src="https://example.com" width="100%" height="400"></iframe>', 'https://example.com', 'Iframe with double quotes'],
    ["<iframe src='https://example.com' width='100%'></iframe>", 'https://example.com', 'Iframe with single quotes'],
    ['<iframe src=https://example.com width=100%></iframe>', 'https://example.com', 'Iframe without quotes'],
    ['<iframe src="//example.com" width="100%"></iframe>', 'https://example.com', 'Scheme-less URL'],
    ['<iframe src="https://example.com" width="100%" height="400" frameborder="0" allowfullscreen></iframe>', 'https://example.com', 'Complex iframe'],
    ['<iframe src="https://example.com" width="100%"', 'https://example.com', 'Malformed iframe'],
    ['<iframe width="100%" height="400"></iframe>', null, 'Iframe without src'],
    ['<div>Some content</div>', null, 'Non-iframe content'],
    ['', null, 'Empty input']
  ];

  testCases.forEach(([input, expected, description]) => {
    const result = testParseIframeSrc(input, expected, description);
    t.equal(result.actual, result.expected, result.description);
  });
  
  t.end();
});

test('parseIframeSrc handles parsing errors gracefully', (t) => {
  const originalDOMParser = global.DOMParser;
  global.DOMParser = () => { throw new Error('DOMParser error'); };
  
  const result = testParseIframeSrc('<iframe src="https://example.com"></iframe>', 'https://example.com', 'Falls back to regex when DOMParser fails');
  t.equal(result.actual, result.expected, result.description);
  
  global.DOMParser = originalDOMParser;
  t.end();
});

