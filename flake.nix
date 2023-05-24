{
  description = "Nix-based dev shell for Node.js";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { self
    , nixpkgs
    , flake-utils
    }:

    flake-utils.lib.eachDefaultSystem (system:
    let
      overlays = [
        (self: super: rec {
          nodejs = super.nodejs-18_x;
          pnpm = super.nodePackages.pnpm;
          yarn = (super.yarn.override { inherit nodejs; });
        })
      ];
      pkgs = import nixpkgs { inherit overlays system; };
      getExe = pkgs.lib.getExe;
    in
    {
      devShells.default = pkgs.mkShell {
        packages = with pkgs; [
          node2nix
          nodejs
          yarn
          nodePackages_latest.gulp-cli
        ];

        shellHook = ''
          echo "node `${getExe pkgs.nodejs} --version`"
        '';
      };
    });
}
