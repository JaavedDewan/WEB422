import React from 'react';
import { Button, Pagination } from 'react-bootstrap';

const Paginate = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-3">
      <Pagination>
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        />
        {Array.from({ length: totalPages }).map((_, index) => (
          <Pagination.Item
            key={index}
            active={index === currentPage}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        />
      </Pagination>
    </div>
  );
};

export default Paginate;
