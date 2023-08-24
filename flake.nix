{
  inputs = {
    utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/master";
    nix-filter.url = "github:numtide/nix-filter";
  };

  outputs = {
    self,
    nixpkgs,
    utils,
    nix-filter,
  }:
    utils.lib.eachDefaultSystem
    (system: let
      pkgs = import nixpkgs {
        inherit system;
      };

      filter = nix-filter.lib;

      nodejs = pkgs.nodejs-18_x;

      node_modules = pkgs.stdenv.mkDerivation {
        name = "node_modules";
        __noChroot = true;

        src = filter {
          root = ./.;
          include = [
            ./package.json
            ./package-lock.json
          ];
        };

        configurePhase = ''
          export HOME=$TMP
        '';

        buildInputs = [ nodejs ];

        buildPhase = ''
          ${nodejs}/bin/npm ci
        '';

        installPhase = ''
          mkdir $out
          mv node_modules $out/node_modules
        '';
      };
    in {
      packages = {

        default = pkgs.stdenv.mkDerivation {
          name = "drowning";

          src = filter {
            root = ./.;
            exclude = [
              ./node_modules
            ];
          };

          nativeBuildInputs = [ nodejs ];

          configurePhase = ''
            ln -sf ${node_modules}/node_modules node_modules
            export HOME=$TMP
          '';

          buildPhase = ''npm run build'';

          installPhase = ''
            mkdir -p $out
            mv dist/index.html $out/
            mv dist/assets $out/
          '';
        };

      };
    }) // {
      nixosModule = {config, lib, pkgs, ...}:
        with lib;
        let cfg = config.ashe.services.drowning;
            pkg = self.packages.${pkgs.system}.default;

        in {
          options.ashe.services.drowning = {
            enable = mkEnableOption "Enables the drowning site";

            domain = mkOption rec {
              type = types.str;
              default = "drowning.ashen.earth";
              example = default;
              description = "The domain name to serve the Drowning Among Stars game at";
            };
          };

          config = mkIf cfg.enable {
            services.nginx.virtualHosts.${cfg.domain} = {
              locations."/" = {
                root = "${pkg}";
              };
              forceSSL = true;
              enableACME = true;
            };
          };
        };
    };
}
