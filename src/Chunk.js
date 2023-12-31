export default function Chunk ( start, end, content ) {
	this.start = start;
	this.end = end;
	this.original = content;

	this.content = content;
	this.storeName = false;
	this.edited = false;
}

Chunk.prototype = {
	clone () {
		const chunk = new Chunk( this.start, this.end, this.original );
		chunk.content = this.content;
		chunk.storeName = this.storeName;
		chunk.edited = this.edited;

		return chunk;
	},

	edit ( content, storeName ) {
		this.content = content;
		this.storeName = storeName;

		this.edited = true;

		return this;
	},

	split ( index ) {
		if ( index === this.start ) return this;

		const sliceIndex = index - this.start;

		const originalBefore = this.original.slice( 0, sliceIndex );
		const originalAfter = this.original.slice( sliceIndex );

		this.original = originalBefore;

		const newChunk = new Chunk( index, this.end, originalAfter );
		this.end = index;

		if ( this.edited ) {
			if ( this.content.length ) throw new Error( `Cannot split a chunk that has already been edited ("${this.original}")` );

			// zero-length edited chunks are a special case (overlapping replacements)
			newChunk.edit( '', false );
			this.content = '';
		} else {
			this.content = originalBefore;
		}

		return newChunk;
	}
};
