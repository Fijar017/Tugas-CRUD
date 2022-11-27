import './App.css';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import CurrencyFormat from 'react-currency-format';

function App() {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [image, setImage] = useState();
  const [price, setPrice] = useState();

  const [nameEdit, setNameEdit] = useState('');
  const [deskripsiEdit, setDeskripsiEdit] = useState('');
  const [imageEdit, setImageEdit] = useState();
  const [priceEd, setPriceEdit] = useState();
  const [show, setShow] = useState(false);
  

  const handleClose = () => setShow(false);
  const handleShow = (id) => setShow(id);

  const getData = () => {
    Axios({
      method: 'get',
      url: 'http://localhost:7777/employee',
    })
      .then(function (response) {
        setData(response.data.data)
      });
  }

  const handleEdit = () => {
    Axios({
      method: 'put',
      url: `http://localhost:7777/employee/${show}`,
      data: {
        name: nameEdit,
        deskripsi: deskripsiEdit,
        image: imageEdit,
        price: parseInt(price)
      }
    })
      .then(function (response) {
        handleClose()
        setNameEdit('')
        setDeskripsiEdit('')
        setImageEdit()
        setPriceEdit()
        getData()
      });
  }

  const handleAdd = (e) => {
    e.preventDefault()
    Axios({
      method: 'post',
      url: 'http://localhost:7777/employee',
      data: {
        name: name,
        deskripsi: deskripsi,
        image:image,
        price: parseInt(price)
      }
    })
      .then(function (response) {
        setName('')
        setDeskripsi('')
        setImage()
        getData()
        setPrice()
      });
  }

  const handleDelete = (id) => {
    if (window.confirm(`Delete ID ${id}?`)) {
      Axios({
        method: 'post',
        url: `http://localhost:7777/employee/delete/${id}`,
      })
        .then(function (response) {
          getData()
        });
    }
  }

  useEffect(() => {
    getData()
  }, []);

  return (
    <>
      <Form onSubmit={handleAdd}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control value={name} name="name" type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDeskripsi">
          <Form.Label>Deskripsi</Form.Label>
          <Form.Control value={deskripsi} name="deskripsi" type="text" onChange={(e) => setDeskripsi(e.target.value)} placeholder="Enter deskripsi" />
        </Form.Group>

        <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="text" placeholder="Enter URL Image" onChange={(e) => setImage(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" placeholder="Enter Price" onChange={(e) => setPrice(e.target.value)} />
            </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Deskripsi</th>
            <th>Image</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.deskripsi}</td>
              <td><img src={item.image} alt={item.name} style={{ width: "2.2rem" }} /></td>
              <td><CurrencyFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={'Rp.  '} /></td>
              <td><ButtonGroup aria-label="Action">
                <Button size="sm" variant="primary" onClick={() => handleShow(item.id)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
              </ButtonGroup></td>
            </tr>
          })}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control value={nameEdit} type="text" onChange={(e) => setNameEdit(e.target.value)} placeholder="Enter name" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicDeskripsi">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control value={deskripsiEdit} type="text" onChange={(e) => setDeskripsiEdit(e.target.value)} placeholder="Enter deskripsi" />
            </Form.Group>
          </Form>

          <Form.Group className="mb-3">
              <Form.Label>image</Form.Label>
              <Form.Control type="text" onChange={(e) => setImageEdit(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" onChange={(e) => setPriceEdit(e.target.value)} />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
