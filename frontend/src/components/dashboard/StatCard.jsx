import React from 'react';
import PropTypes from 'prop-types';
import './StatCard.css';

/**
 * Card reutilizável para exibir uma métrica estatística.
 * @param {{
 * title: string,
 * value: string | number,
 * icon: string,
 * color: string
 * }} props
 */
function StatCard({ title, value, icon, color }) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-card-info">
        <h3 className="stat-card-title">{title}</h3>
        <p className="stat-card-value">{value}</p>
      </div>
      <div className="stat-card-icon" style={{ backgroundColor: color }}>
        <i className={icon} />
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
};

StatCard.defaultProps = {
  color: '#3498db',
};

export default React.memo(StatCard);