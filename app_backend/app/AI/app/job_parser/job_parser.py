from bs4 import BeautifulSoup
import requests
import logging
from typing import Dict, List,Optional
from pydantic import BaseModel
from requests.exceptions import RequestException
logger = logging.getLogger(__name__)

class JobDetails(BaseModel):
    job_title: str
    job_location: str
    post_date: str
    job_desc_link: str
    responsibilities: List[str]
    class Config:
        frozen = True
class JobParse:
    _BASE_URL = "https://myjobo.com/search-jobs"
    _JOB_CARD_SELECTOR = "div.job-card"
    _NO_RESULTS_SELECTOR = "div.col-md-12.text-center.text-gray"
    _JOB_TITLE_SELECTOR = "h5.card-title.text-secondary.fs-18.mb-0"
    _LOCATION_SELECTOR = "div.desc.d-flex.me-4 p.fs-14.text-gray.mb-2"
    _POST_DATE_SELECTOR = "div.desc.d-flex p.fs-14.text-gray.mb-2"
    _JOB_LINK_SELECTOR = "a.card.py-30.border-0"
    _RESPONSIBILITIES_SELECTOR = "div.key-responsibilities p"
    def __init__(self,position:str):
        self.position = position.strip().lower()
        self.job_results: Optional[List[JobDetails]] = None
    def search_for_jobs(self) -> List[JobDetails]:
        try:
            html = self._fetch_search_results()
            self.job_results = self._parse_search_results(html)
            return self.job_results
        except Exception as e:
            logger.error(f"Job search failed: {str(e)}")
            raise
    def _fetch_search_results(self) -> str:
        params = {"keywords": self.position.replace(" ", "+")}
        url = f"{self._BASE_URL}?{requests.compat.urlencode(params)}"
        
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.text
        except RequestException as e:
            logger.error(f"Request failed: {str(e)}")
            raise
    def _parse_search_results(self, html: str) -> List[JobDetails]:
        soup = BeautifulSoup(html, "lxml")
        if self._check_no_results(soup):
            return [JobDetails(
                job_title="",
                job_location="",
                post_date="",
                job_desc_link="",
                responsibilities=[f"No vacancy found for {self.position} position"]
            )]
        jobs = []
        for card in soup.select(self._JOB_CARD_SELECTOR):
            try:
                job = self._parse_job_card(card)
                if job:
                    jobs.append(job)
            except Exception as e:
                logger.warning(f"Failed to parse job card: {str(e)}")
        
        return jobs
    def _check_no_results(self, soup: BeautifulSoup) -> bool:
        no_results = soup.select_one(self._NO_RESULTS_SELECTOR)
        return no_results and "No job vacancies" in no_results.text

    def _parse_job_card(self, card: BeautifulSoup) -> Optional[JobDetails]:
        job_div = card.find("div", class_="card-body p-0")
        if not job_div:
            return None

        return JobDetails(
            job_title=self._safe_select_text(job_div, self._JOB_TITLE_SELECTOR),
            job_location=self._safe_select_text(job_div, self._LOCATION_SELECTOR),
            post_date=self._safe_select_text(card, self._POST_DATE_SELECTOR),
            job_desc_link=self._get_job_description_link(job_div),
            responsibilities=self._get_responsibilities(job_div)
        )

    @staticmethod
    def _safe_select_text(soup: BeautifulSoup, selector: str) -> str:
        element = soup.select_one(selector)
        return element.text.strip() if element else ""

    def _get_job_description_link(self, job_div: BeautifulSoup) -> str:
        link_tag = job_div.select_one(self._JOB_LINK_SELECTOR)
        return link_tag['href'].strip() if link_tag and 'href' in link_tag.attrs else ""

    def _get_responsibilities(self, job_div: BeautifulSoup) -> List[str]:
        link = self._get_job_description_link(job_div)
        if not link:
            return []
        
        try:
            html = requests.get(link, timeout=10).text
            soup = BeautifulSoup(html, "lxml")
            responsibilities_div = soup.select_one(self._RESPONSIBILITIES_SELECTOR)
            return [p.text.strip() for p in responsibilities_div.find_all("p")] if responsibilities_div else []
        except RequestException as e:
            logger.warning(f"Failed to fetch job description: {str(e)}")
            return []
    def initializer(self):
        self.search_for_jobs()