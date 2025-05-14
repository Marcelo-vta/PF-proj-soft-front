import { useEffect, useState } from 'react';
import './App.css';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const [token, setToken] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState('');

  const [tarefas, setTarefas] = useState([]);
  const [roles, setRoles] = useState([]);

  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently
  } = useAuth0();

  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload['https://musica-insper.com/email'];
      const userRoles = payload['https://musica-insper.com/roles'] || [];
      setRoles(userRoles);

      fetch('http://18.231.253.225:8080/tarefa', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }).then(response => response.json())
        .then(data => setTarefas(data))
        .catch(error => alert(error));
    }
  }, [token]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
      } catch (e) {
        console.error('Erro ao buscar token:', e);
      }
    };

    if (isAuthenticated) {
      fetchToken();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    return <LoginButton />;
  }

  function salvarTarefa() {
    fetch('http://18.231.253.225:8080/tarefa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        'titulo': titulo,
        'descricao': descricao,
        'prioridade': prioridade
      })
    }).then(response => response.json())
      .then(() => window.location.reload())
      .catch(error => alert(error));
  }

  function excluirTarefa(id) {
    fetch('http://18.231.253.225:8080/tarefa/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(() => window.location.reload())
      .catch(error => alert(error));
  }

  return (
    <>
      <div>
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <LogoutButton />
        </div>

        {roles.includes('ADMIN') && (
          <div>
            <h3>Criar Tarefa</h3>
            Título: <input type='text' onChange={e => setTitulo(e.target.value)} /><br />
            Descrição: <input type='text' onChange={e => setDescricao(e.target.value)} /><br />
            Prioridade: <input type='number' onChange={e => setPrioridade(e.target.value)} /><br />
            <button onClick={salvarTarefa}>Cadastrar</button>
          </div>
        )}

        <h3>Lista de Tarefas</h3>
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Descrição</th>
              <th>Prioridade</th>
              <th>Usuário</th>
              {roles.includes('ADMIN') && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {tarefas.map((tarefa, index) => (
              <tr key={index}>
                <td>{tarefa.titulo}</td>
                <td>{tarefa.descricao}</td>
                <td>{tarefa.prioridade}</td>
                <td>{tarefa.email}</td>
                {roles.includes('ADMIN') && (
                  <td>
                    <button onClick={() => excluirTarefa(tarefa.id)}>Excluir</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
