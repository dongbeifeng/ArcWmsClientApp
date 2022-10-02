import { Space } from "antd";
import React from "react";
import Text from 'antd/es/typography/Text';

export const VerticalCell: React.FC<any[]> = (values) => {
  return (
    <>
      {values && values.length ? (
        <Space direction="vertical" size="small">
          {values.map((x) => (
            <Text key={x}>
              {x}
            </Text>
          ))}
        </Space>
      ) : (
        <Text>-</Text>
      )}
    </>
  );
};
