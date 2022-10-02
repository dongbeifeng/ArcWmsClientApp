import { Button, Card, Form, message, Upload } from 'antd';
import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { InboxOutlined } from '@ant-design/icons';
import reqwest from 'reqwest';
import type { IApiData } from '@/services/IApiData';
import type { ArgsProps } from 'antd/es/message';
import { getToken } from '@/tokenService';

export default () => {

  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState(new Array());

  const handleUpload = () => {

    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('file', file);
    });

    setUploading(true);

    reqwest({
      url: 'api/matl/import-materials',
      method: 'post',
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      processData: false,
      data: formData,
      success: (res: IApiData<string>) => {
        setFileList([]);
        setUploading(false);
        message.success(res.data);
      },
      error: (res: { response: string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactNodeArray | React.ReactPortal | ArgsProps | null | undefined; }) => {
        setUploading(false);

        message.error(res.response);
      },
    });
  };


  // const propso = {
  //   name: 'file',
  //   action: '/materials/actions/import',
  //   headers: {
  //     authorization: 'authorization-text',
  //   },

  //   onChange(info) {
  //     if (info.file.status !== 'uploading') {
  //       console.log(info.file, info.fileList);
  //     }

  //     if (info.file.status === 'done') {
  //       message.success(`${info.file.name} 文件上传成功`);
  //     } else if (info.file.status === 'error') {
  //       console.log(info);
  //       message.error(`${info.file.name} 文件上传失败.`);
  //     }
  //   },
  // };

  const props = {
    onRemove: (file: any) => {
      setFileList(state => {
        const index = state.indexOf(file);
        const newFileList = state.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: (file: any) => {
      setFileList(state => [...state, file]);
      return false;
    },
    fileList,
  };

  return (
    <PageContainer content="从 Excel 文件导入物料主数据" >
      <Card bordered={false}>
        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
          <Upload.Dragger {...props} maxCount={1} listType='picture'>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击选择文件，或拖动文件到此区域</p>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? '正在上传' : '开始上传'}
          </Button>


          &nbsp;&nbsp;

          <Button type='default' href='/download/template-import-materials.xlsx'>
            下载模板
          </Button>


        </Form.Item>

      </Card>
    </PageContainer>
  );
};
