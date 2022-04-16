import { Table } from 'antd';

export default function TableRenderer({ data }) { 
  const columns = [
    {
      title: 'Supplier Name',
      dataIndex: 'x',
      key: 'x',
    },
    {
      title: 'Order Count',
      dataIndex: 'measure',
      key: 'measure',
    }
  ]
  return (
    <Table 
      pagination={true} 
      columns={columns} 
      dataSource={data} 
    />
  );
}


