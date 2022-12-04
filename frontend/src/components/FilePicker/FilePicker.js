import React, { useRef, Component, useState, useContext } from 'react'
import axios from 'axios'
import StructureContext from '../StructureContext/StructureContext'

function FilePicker(props) {

  const [file, setFile] = useState('')  

  function handleFile(e) {
    console.log(e.target.files)
    setFile(e.target.files[0])
  }

  function handleUpload() {
    props.setState('')
    const formData = new FormData()
    formData.append('file', file)
    axios.post("http://127.0.0.1:5000/file", formData).then((res) => {
      props.setState(res.data)
    })
  }

  return(
      <div className="container">
        <form>
          <label>Select File</label>
          <input 
            type="file"
            name="file"
            onChange={handleFile}
          />
        </form>
        <button onClick={handleUpload}>
          Upload POSCAR
        </button>
      </div>
    )
}

export default FilePicker