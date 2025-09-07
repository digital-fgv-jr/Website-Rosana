# Website-Rosana
Projeto de trainee de Digital Development da gestão 25.2 destinado a criar Website para a joalheria da cliente Rosana

# Django Rest Framework Backend

## How to Run

### Step 0: Go to the Backend directory

First you'll need to go to the backend directory using the command:

```bash
cd backend
```

### Step 1: Set Up the Environment

#### Step 1.1 – Install `venv` (if not installed)

We will use the `venv` library. If it is not already installed, run:

```bash
pip install venv
```

#### Step 1.2 – Create the Virtual Environment

To create a virtual environment, use the following command:

* On **Linux**:

  ```bash
  python -m venv .venv
  ```
* On **Windows**:

  ```powershell
  py -m venv .venv
  ```

#### Step 1.3 – Activate the Virtual Environment

Activate the virtual environment with:

* On **Linux**:

  ```bash
  source .venv/bin/activate
  ```
* On **Windows**:

  ```powershell
  .venv\Scripts\activate
  ```

#### Step 1.35 - Enabling Execution

If your **Windows** is not letting you execute the activation, use the folowwing command:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
Then press `Y`.

If your **Linux** is not letting you execute the activation, then add the permission with:
```bash
chmod +x venv/bin/activate
```

Now you should be able to activate the virtual environment.

#### Step 1.4 – Install Dependencies

Install all project dependencies by running:

```bash
pip install -r requirements.txt
```

---

### Step 2: Start the Server

To start the server, you'll need to execute the following django `manage.py` command:

```powershell
python manage.py runserver
```

### Aditional: Stop the server

To stop the server, you'll only need to press `CTRL+C` in the termina where the server is running.

---