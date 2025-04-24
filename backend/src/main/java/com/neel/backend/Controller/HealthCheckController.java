    package com.neel.backend.Controller;

    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RestController;

    @RestController
    public class HealthCheckController {
        // getmapping is .get
        @GetMapping("/health-check")
        public String healthCheck(){
            return "ok!";
        }
    }
