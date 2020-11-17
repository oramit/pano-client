exports.splitToChunks = (array, chunkSize) => {
    let chunks = [], index = 0, length = array.length;
    while (index < length) {
        //I could add the chunk size and then to slice
        chunks.push(array.slice(index, index += chunkSize));
    }
    return chunks;
}