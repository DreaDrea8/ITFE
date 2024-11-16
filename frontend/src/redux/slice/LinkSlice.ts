import { jwtDecode } from 'jwt-decode'
import {createSlice} from '@reduxjs/toolkit'

export interface storedLink {
  fileId : number, 
  jwt: string,
  exp: Date
}

interface DecodedLinkToken {
  link: number,
  file: number,
  iat: Date,
  exp: Date
}

export interface LinkInitialStateType {
  linkList:storedLink[] 
} 

const initialState: LinkInitialStateType = {
  linkList: JSON.parse(localStorage.getItem('linkList') || '[]'),
}

const LinkSlice = createSlice({
  name: 'LinkSlice',
  initialState,
  reducers: {
    addLink: (state, action:{payload:string}) => {
      const decoded: DecodedLinkToken = jwtDecode(action.payload)
      const storedLink: storedLink = {
        fileId: decoded.file,
        jwt: action.payload,
        exp: decoded.exp
      }
      const filter = state.linkList.filter((link) => link.fileId !== storedLink.fileId)
      const newLinkList = [...filter, storedLink]
      state.linkList = newLinkList
      localStorage.setItem('linkList', JSON.stringify(state.linkList))
    },
    resetLinkList: (state) => {
      localStorage.removeItem('linkList')
      state.linkList = []
    }
  },
})


export const LinkServices = {
  actions: LinkSlice.actions,
}

const LinkReducer = LinkSlice.reducer

export default LinkReducer