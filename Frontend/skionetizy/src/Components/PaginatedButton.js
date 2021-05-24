import React from 'react';

const PaginatedButton = ({ index, setCurrentBlog, button }) => {
	return (
		<div>
			<a key={index} onClick={() => setCurrentBlog(button)}>
				{button + 1}
			</a>
		</div>
	);
};

export default PaginatedButton;