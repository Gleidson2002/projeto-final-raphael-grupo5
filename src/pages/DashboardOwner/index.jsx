import { useState, useEffect } from "react";
import CreateModal from "../../components/Modals";
import Input from "../../components/Input";
import { StyledDiv, StyledLabel, StyledForm, StyledText } from "./styles";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/Button";
import { getOwnerAndPets } from "../../services/apiOwner";
import Header from "../../components/Header";
import UserHeader from "../../components/UserHeader";
import ListPets from "../../components/ListPets";
import { apiOwner } from "../../services";
import ModalDate from "../../components/ModalDate";

function DashboardOwner() {
  const ownerToken = localStorage.getItem("Token");
  const ownerId = JSON.parse(localStorage.getItem("User"))
  const [modalCreatePet, setmodalCreatePet] = useState(false);
  const [modalDeletePet, setmodalDeletePet] = useState(false)
  const [authenticated, setAuthenticated] = useState(false);
  const [ownerAndPets, setOwnerAndPets] = useState({});
  const [modalEditPet,setmodalEditPet] = useState(false)
  const [modalDate, setmodalDate] = useState(true)
  const [Temp, setTemp] = useState({})
  
  useEffect(() => {
    if (ownerToken) {
      

      getOwnerAndPets(ownerId.id, ownerToken).then((res) => setOwnerAndPets(res));

      return setAuthenticated(true);
    }
  }, [authenticated]);

 

  const formSchema = yup.object().shape({
    name: yup.string().required("Escreva o nome do animal"),
    type: yup.string().required("Escreva o tipo de animal"),
    age: yup.string().required("Diga a idade do animal"),
    size: yup.string().required("Especifique o porte do animal"),
    breed: yup.string().required("Especifique a raça do animal"),
    obs_care: yup.string(),
    start:yup.date("Especifique uma data").required("Especifique a data inicial")
  });
 
  function dados(dados) {
    toast.success(`${dados.nome} foi cadastrado com sucesso`);
   
    
    getOwnerAndPets(ownerId.id, ownerToken).then((res) => setOwnerAndPets(res));

    apiOwner.post("/pet",{
      name:dados.name,
      type:dados.type,
      age:dados.age,
      breed: dados.breed,
      size:dados.size,
      obs_care:dados.obs_care,
      userId:ownerAndPets.id
      

    }, { headers:{
      "Authorization": `Bearer ${ownerToken}`}

    }).then(res=>console.log(res))
    setmodalCreatePet(false);
  }
  function dadosEditar(dados){
   apiOwner.put(`/pet/${Temp.id}`,{
    name:dados.name,
    type:dados.type,
    age:dados.age,
    breed: dados.breed,
    size:dados.size,
    obs_care:dados.obs_care,
    userId:ownerAndPets.id
   },{headers:{
    "Authorization": `Bearer ${ownerToken}`
   }}).then(res=>res.status===200&&toast.success("Editado com sucesso"))
   .catch(res=>console.log(res.response.data))
   setmodalEditPet(false)
   setTemp({})
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

 
  function modalEditar(dados,id){
    setTemp({dados,id})

    setmodalEditPet(true)
    
    

  }
  
  function deletarCard(id){
    apiOwner.delete(`/pet/${id}`,{
      headers:{
        "Authorization": `Bearer ${ownerToken}`
      }
    })
    toast.success("Excluido com sucesso")
    setTemp({})
    setmodalDeletePet(false)
    
  }
  
  function dadosDate(dados){
    console.log(dados)

  }

  function modalDeletar(dados){
    
    setTemp(dados)
    setmodalDeletePet(true)
    

  }

  return (
    <>
    
      <Header />
      {modalDeletePet?
      <CreateModal>

      <StyledDiv fd="column">
            
              <StyledLabel color="black" we="bold"  m="0 auto" >
                Você quer mesmo excluir o pet: <StyledText margin="0 auto" fontsize="20px" ta="center">{Temp.name}?</StyledText> 
              </StyledLabel>
              <StyledDiv>
                <Button onClick={()=>deletarCard(Temp.id)} type="submit" w="40%">
                  Excluir
                </Button>
                <Button
                  onClick={(e) => {
                    setmodalDeletePet(false);
                    setTemp({})
                  }}
                  w="40%"
                  isGray
                >
                  Cancelar
                </Button>
              </StyledDiv>
            
          </StyledDiv>
          </CreateModal>
      :""}

{modalDate?<ModalDate setMdate={setmodalDate} dadosDate={dadosDate}/>:""}

      {modalEditPet?<CreateModal>
        

        <StyledDiv fd="column">
            <StyledForm onSubmit={handleSubmit(dadosEditar)}>
              <StyledDiv fd="column">
                <Input label="Nome:" register={register} defaultValue={Temp.dados.name} name="name" />
                <StyledLabel color="pink" m="0">
                  {errors.name?.message}
                </StyledLabel>

                <Input
                  label="Tipo de animal:"
                  register={register}
                  name="type"
                  defaultValue={Temp.dados.type}
                />
                <StyledLabel color="pink" m="0">
                  {errors.type?.message}
                </StyledLabel>

                <Input
                  label="Idade:"
                  type="number"
                  register={register}
                  name="age"
                  defaultValue={Temp.dados.age}
                />
                <StyledLabel color="pink" m="0">
                  {errors.age?.message}
                </StyledLabel>

                <Input label="Porte fisico:" register={register} defaultValue={Temp.dados.size} name="size" />
                <StyledLabel color="pink" m="0">
                  {errors.size?.message}
                  
                </StyledLabel>

                <Input label="Raça:" register={register} name="breed" defaultValue={Temp.dados.breed} />
                <StyledLabel color="pink" m="0">
                  {errors.breed?.message}
                </StyledLabel>

                <Input
                  label="Observações e cuidados"
                  register={register}
                  name="obs_care"
                  defaultValue={Temp.obs_care}
                />
              </StyledDiv>
              <StyledDiv>
                <Button type="submit" w="40%">
                  Concluir
                </Button>
                <Button
                  onClick={(e) => {
                    setmodalEditPet(false);
                    setTemp({})
                  }}
                  w="40%"
                  isGray
                >
                  Cancelar
                </Button>
              </StyledDiv>
            </StyledForm>
          </StyledDiv>

      </CreateModal>:""}



      {modalCreatePet ? (
        <CreateModal>
          <StyledDiv fd="column">
            <StyledForm onSubmit={handleSubmit(dados)}>
              <StyledDiv fd="column">
                <Input label="Nome:" register={register} name="name" />
                <StyledLabel color="pink" m="0">
                  {errors.nome?.message}
                </StyledLabel>

                <Input
                  label="Tipo de animal:"
                  register={register}
                  name="type"
                />
                <StyledLabel color="pink" m="0">
                  {errors.type?.message}
                </StyledLabel>

                <Input
                  label="Idade:"
                  type="number"
                  register={register}
                  name="age"
                />
                <StyledLabel color="pink" m="0">
                  {errors.age?.message}
                </StyledLabel>

                <Input label="Porte fisico:" register={register} name="size" />
                <StyledLabel color="pink" m="0">
                  {errors.size?.message}
                </StyledLabel>

                <Input label="Raça:" register={register} name="breed" />
                <StyledLabel color="pink" m="0">
                  {errors.breed?.message}
                </StyledLabel>

                <Input
                  label="Observações e cuidados"
                  register={register}
                  name="obs_care"
                />
              </StyledDiv>
              <StyledDiv>
                <Button type="submit" w="40%">
                  Concluir
                </Button>{" "}
                <Button
                  onClick={(e) => {
                    setmodalCreatePet(false);
                  }}
                  w="40%"
                  isGray
                >
                  Cancelar
                </Button>
              </StyledDiv>
            </StyledForm>
          </StyledDiv>
        </CreateModal>
      ) : (
        ""
      )}


      <UserHeader
        name={ownerAndPets?.name}
        userType="owner"
        setmodalCreatePet={setmodalCreatePet}
      />

      <ListPets modalEditar={modalEditar} modalDeletar={modalDeletar} pets={ownerAndPets?.pet} />
    </>
  );
}

export default DashboardOwner;
