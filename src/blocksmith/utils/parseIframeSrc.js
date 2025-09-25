/**
 * Parses iframe HTML and extracts the src URL
 * @param {string} value - The input string that may contain iframe HTML
 * @returns {string|null} - The extracted src URL or null if not found
 */
const parseIframeSrc = (value) => {
  // Check if the value contains an iframe tag
  if (value.includes('<iframe') && value.includes('src=')) {
    let srcUrl = null;
    
    try {
      // Try DOMParser first
      const parser = new DOMParser();
      const doc = parser.parseFromString(value, 'text/html');
      const iframe = doc.querySelector('iframe');
      
      if (iframe) {
        srcUrl = iframe.getAttribute('src') || iframe.src;
      }
    } catch (e) {
      // If DOMParser fails, log the error but continue to regex fallback
      console.error('parseIframeSrc: Failed to parse iframe', e);
    }
    
    // If DOMParser didn't work, try regex as fallback
    if (!srcUrl) {
      const srcMatch = value.match(/src=["']?([^"'\s>]+)["']?/i);
      if (srcMatch && srcMatch[1]) {
        srcUrl = srcMatch[1];
      }
    }
    
    // If we found a URL, process and return it
    if (srcUrl) {
      // Handle scheme-less URLs
      if (srcUrl.startsWith('//')) {
        srcUrl = 'https:' + srcUrl;
      }
      return srcUrl;
    }
  }
  
  // If it's not an iframe tag or parsing failed, return null
  return null;
};

export default parseIframeSrc;
