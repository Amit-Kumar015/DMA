import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G, Line, Circle, Text as SvgText } from 'react-native-svg';
import Text from './Text'; // Use RN Text if needed

// Define BMI ranges with color and labels
const BMI_RANGES = [
  { label: 'Underweight', color: '#FF5722', min: 0, max: 18.4 },
  { label: 'Normal', color: '#4CAF50', min: 18.5, max: 24.9 },
  { label: 'Overweight', color: '#FFEB3B', min: 25, max: 29.9 },
  { label: 'Obese', color: 'red', min: 30, max: 100 },
];

const BMIGauge = ({ bmi = 0 }) => {
  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  const labelRadius = 125;
  const startAngle = -90;
  const totalAngle = 180;
  const sectorAngle = totalAngle / BMI_RANGES.length;

  // Converts polar coordinates to cartesian
  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  // Creates arc path for SVG
  const describeArc = (x, y, r, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  // Build arcs and label positions
  const arcs = BMI_RANGES.map((range, index) => {
    const rangeStartAngle = startAngle + sectorAngle * index;
    const rangeEndAngle = rangeStartAngle + sectorAngle;
    const labelAngle = (rangeStartAngle + rangeEndAngle) / 2;
    const labelCoord = polarToCartesian(centerX, centerY, labelRadius, labelAngle);

    return {
      ...range,
      path: describeArc(centerX, centerY, radius, rangeStartAngle, rangeEndAngle),
      labelX: labelCoord.x,
      labelY: labelCoord.y,
      startAngle: rangeStartAngle,
      endAngle: rangeEndAngle,
    };
  });

  // Get the current range based on BMI value
  const currentRange = BMI_RANGES.find(
    r => bmi >= r.min && bmi <= r.max
  ) || BMI_RANGES[0];

  const rangeArc = arcs.find(
    r => bmi >= r.min && bmi <= r.max
  ) || arcs[0];

  // Calculate needle angle
  const getNeedleAngle = () => {
    if (!rangeArc) return startAngle;

    const clampedBMI = Math.min(Math.max(bmi, currentRange.min), currentRange.max);
    return (
      ((clampedBMI - currentRange.min) / (currentRange.max - currentRange.min)) *
        (rangeArc.endAngle - rangeArc.startAngle) +
      rangeArc.startAngle
    );
  };

  const angle = getNeedleAngle();
  const angleRad = (angle * Math.PI) / 180;
  const arrowLength = radius + 10;
  const arrowStartLength = 10;

  const arrowX = centerX + arrowLength * Math.cos(angleRad);
  const arrowY = centerY + arrowLength * Math.sin(angleRad);
  const arrowStartX = centerX + arrowStartLength * Math.cos(angleRad);
  const arrowStartY = centerY + arrowStartLength * Math.sin(angleRad);

  return (
    <View style={styles.container}>
      <Text h5 bold style={styles.bmiText}>
        BMI = {bmi?.toFixed(1)}{' '}
        <Text style={{ color: currentRange.color }}>
          ({currentRange.label})
        </Text>
      </Text>

      <Svg width="300" height="180">
        <G>
          {/* Draw arcs and labels */}
          {arcs.map((arc, idx) => (
            <React.Fragment key={idx}>
              <Path
                d={arc.path}
                fill="none"
                stroke={arc.color}
                strokeWidth="20"
                strokeOpacity={0.7}
              />
              <SvgText
                x={arc.labelX}
                y={arc.labelY}
                fontSize="12"
                fontWeight="bold"
                fill={arc.color}
                textAnchor="middle"
              >
                {arc.label}
              </SvgText>
            </React.Fragment>
          ))}

          {/* Needle */}
          {/* <Line
            x1={arrowStartX}
            y1={arrowStartY}
            x2={arrowX}
            y2={arrowY}
            stroke="black"
            strokeWidth="3"
          /> */}
          {/* <Circle cx={centerX} cy={centerY} r="5" fill="black" /> */}
        </G>
      </Svg>

      <Text style={styles.labelText}>
        You fall under:{' '}
        <Text style={{ color: currentRange.color }}>
          {currentRange.label}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  bmiText: {
    marginBottom: 10,
  },
  labelText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default BMIGauge;
