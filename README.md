# Lili Project

Monorepo that contains all core libraries and applications for Lili, the AI powered programming assistant.

This project was generated using [Nx](https://nx.dev).

Currently some repos needs updates, they are in early stage. For now we are focusing 
on the core libraries and the [Lili CLI](https://github.com/LiliGPT/lili) - the terminal GUI application.

## Setup Local Environment

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Rust](https://www.rust-lang.org/)
- [Nx](https://nx.dev)
- [Lili CLI](https://github.com/LiliGPT/lili) - instructions below

### Setup Lili CLI

Open your terminal in the root folder of this project, than run the following command:

> Note that we are renaming `lili` folder to `cli` to make the folder architecture 
> more understandable.

```bash
cd packages
git clone git@github.com:LiliGPT/lili.git cli
```

Now you can run the Lili CLI locally and start making changes to the code.

### Run Lili CLI

```bash
cd packages
cd cli
cargo run <project_dir>
```

Replace `<project_dir>` with the path to any repository you want to test Lili on.
