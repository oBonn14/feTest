import React from 'react';
import { Breadcrumb, Layout, Menu, theme, Alert } from 'antd';
import TableData from './Table';
import ModalButton from './Modal';
const { Header, Content, Footer } = Layout;
const App = () => {
  const [isAlertVisible, setIsAlertVisible] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');

  const handleSuccess = (message) => {
    setIsAlertVisible(true);
    setSuccessMessage(message);
  };

  const closeAlert = () => {
    setIsAlertVisible(false);
    setSuccessMessage('');
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu theme="dark" mode="horizontal" />
      </Header>
      <Content
        style={{
          padding: '0 50px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
          }}
        >
        </Breadcrumb>
        <Layout
          style={{
            padding: '24px 0',
            background: colorBgContainer,
          }}
        >
          <Content
            style={{
              padding: '0 24px',
              minHeight: 280,
            }}
          >      
            <ModalButton onSuccess={handleSuccess}/>
            {isAlertVisible && (
        <Alert
          message={successMessage}
          type="success"
          showIcon
          closable
          onClose={closeAlert}
        />
      )}
            Content uhuy
            <TableData/>
          </Content>
        </Layout>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
      </Footer>
    </Layout>
  );
};
export default App;