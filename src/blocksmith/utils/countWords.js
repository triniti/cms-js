export default text => text.trim().split((/\s+/)).filter(word => word.length).length;
